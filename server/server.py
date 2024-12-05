import os
import cv2
import imutils
import pytesseract
# Modify your tesseract cmd file path
pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'
import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'public/uploads'
TRANSFORMED_FOLDER = 'public/transformed'
DRAFT_FOLDER = 'public/drafts'
TEXT_FOLDER = 'public/texts'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TRANSFORMED_FOLDER'] = TRANSFORMED_FOLDER
app.config['DRAFT_FOLDER'] = DRAFT_FOLDER
app.config['TEXT_FOLDER'] = TEXT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TRANSFORMED_FOLDER, exist_ok=True)

#########################################
# Functions
#########################################

def find_Contours(image):
    contours, hierarchy = cv2.findContours(image.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    if len(contours) == 3:
        contours = contours[0]  # If OpenCV 3.x, we extract the first element (contours)

    # Now grab the contours using imutils
    contours = imutils.grab_contours((contours, hierarchy))

    # Sort the contours based on size and pick the top 5
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    # loop over the contours
    paper_outline = None
    for contour in contours:
        perimeter = cv2.arcLength(contour, True)
        # approximate the contour
        approximation = cv2.approxPolyDP(contour, 0.01 * perimeter, True)

        # if our contour has 4 points, then surely, it should be the paper
        if len(approximation) == 4:
            paper_outline = approximation
            break

    return paper_outline

# Reorder the points
def order_points(points):
   #Initialize List of Coordinates
   rectangle = np.zeros((4, 2), dtype="float32")
   sum_points = points.sum(axis=1)
   #Top Left
   rectangle[0] = points[np.argmin(sum_points)]
   #Bottom Right
   rectangle[2] = points[np.argmax(sum_points)]
   diff_points = np.diff(points, axis=1)
   #Top Right
   rectangle[1] = points[np.argmin(diff_points)]
   #Bottom Left
   rectangle[3] = points[np.argmax(diff_points)]
   return rectangle

# Warp the Image
def warp_image(image, pts):
    rect = order_points(pts)
    (tl, tr, br, bl) = rect

    # Compute Width and Height
    width_A = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    width_B = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    max_width = max(int(width_A), int(width_B))

    height_A = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    height_B = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    max_height = max(int(height_A), int(height_B))

    dst = np.array([[0, 0], [max_width - 1, 0], [max_width - 1, max_height - 1], [0, max_height - 1]], dtype="float32")
    
    # Perspective transform from correspoindg points
    transform_matrix = cv2.getPerspectiveTransform(rect, dst)

    # Apply warp
    warped = cv2.warpPerspective(image, transform_matrix, (max_width, max_height))
    return warped

def enhance_image(warped):
    contrast_factor = 1.2  
    enhanced_contrast = cv2.convertScaleAbs(warped, alpha=contrast_factor, beta=0)
    
    brightness_factor = -20 
    adjusted_brightness = cv2.convertScaleAbs(enhanced_contrast, alpha=1, beta=brightness_factor)
    
    saturation_factor = 1.5
    # Convert BGR to HSV
    hsv = cv2.cvtColor(adjusted_brightness, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)
    
    # Increase saturation
    s = cv2.multiply(s, saturation_factor)
    # Ensure 0 to 255 only
    s = np.clip(s, 0, 255) 

    hsv_enhanced = cv2.merge([h, s, v])
    
    enhanced_image = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)

    return enhanced_image

def extract_text(warped_image):
    # Gray Scale the Image
    gray = cv2.cvtColor(warped_image, cv2.COLOR_BGR2GRAY)
    
    # Threshholding to make the text standout more
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    kernel = np.ones((1, 1), np.uint8)
    thresh = cv2.dilate(thresh, kernel, iterations=1)

    # Extract using pytesseract
    text = pytesseract.image_to_string(thresh)

    return text


def document_scanner(image_path,filename):
    # Load the image
    image = cv2.imread(image_path)
    height = image.shape[0]
    width = image.shape[1]

    ratio = 0.2  # Make it smaller for easy processing
    width = int(ratio * width)
    height = int(ratio * height)
    orig = image.copy()
    orig_resized = imutils.resize(image, height=height)
    image = imutils.resize(image, height=height)

    # Convert to Gray scale
    gray_scaled = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Blur the image
    gray_scaled = cv2.GaussianBlur(gray_scaled, (7,7), 0)

    # Dilate the image to remove holes
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT,(9,9))
    dilated = cv2.morphologyEx(gray_scaled, cv2.MORPH_CLOSE, kernel)

    # Find edges using the dilated image
    edged_img = cv2.Canny(dilated,0,84)
    paper_outline = find_Contours(edged_img)
    
    # Store it in Draft Folder to Show it to User which lines has been drawn
    image_draft_path = os.path.join(app.config['DRAFT_FOLDER'], filename) 
    cv2.drawContours(image,[paper_outline],-1,(255,255,0),2)  
    cv2.imwrite(image_draft_path, image)
    
    warped = warp_image(orig, paper_outline.reshape(4, 2) * (1 / ratio))

    enhanced_warped = enhance_image(warped)

    extracted_text = extract_text(enhanced_warped)

    # Store the text file
    # Extract file name
    text_filepath = os.path.splitext(filename)[0] + ".txt"
    text_draft_path = os.path.join(app.config['TEXT_FOLDER'], text_filepath) 
    with open(text_draft_path, "w") as file:
        file.write(extracted_text)

    # Store the final image output

    transformed_path = os.path.join(app.config['TRANSFORMED_FOLDER'], filename)
    cv2.imwrite(transformed_path, enhanced_warped)
    return True


def allowed_file(filename):
    return "." in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#########################################
# Routes
#########################################

# Test API Route
@app.route("/")
def welcome():
    return "Hello World"

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if the request has a file
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    # Check if the file has a valid filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate and save the file
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = document_scanner(filepath,filename)
        if not result:
            return jsonify({'error': 'Could not detect a document in the image'}), 400

        return jsonify({'message': 'File uploaded and transformed successfully', 'filename': filename}), 200

    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["TRANSFORMED_FOLDER"], name)

@app.route('/drafts/<name>')
def download_draft_file(name):
    return send_from_directory(app.config["DRAFT_FOLDER"], name)

@app.route('/texts/<name>')
def download_text_file(name):
    text_filepath = os.path.splitext(name)[0] + ".txt"
    return send_from_directory(app.config["TEXT_FOLDER"], text_filepath)

@app.route('/delete', methods=['DELETE'])
def delete_all_files():
    folders = [
        app.config["TRANSFORMED_FOLDER"],
        app.config["DRAFT_FOLDER"],
        app.config["TEXT_FOLDER"],
        app.config["UPLOAD_FOLDER"]
    ]

    deleted_files = {}

    for folder in folders:
        if os.path.exists(folder):
            files = os.listdir(folder)
            for file in files:
                file_path = os.path.join(folder, file)
                try:
                    os.remove(file_path)  # Remove the file
                    deleted_files.setdefault(folder, []).append(file)
                except Exception as e:
                    return jsonify({"error": f"Failed to delete {file}: {str(e)}"}), 500

    return jsonify({
        "message": "All files deleted successfully"
    }), 200

if __name__ == "__main__":
    app.run(debug=False)
