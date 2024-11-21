import os
import cv2 as cv
import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = 'public/uploads'
TRANSFORMED_FOLDER = 'public/transformed'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['TRANSFORMED_FOLDER'] = TRANSFORMED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1000 * 1000

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(TRANSFORMED_FOLDER, exist_ok=True)

#########################################
# Functions
#########################################

def allowed_file(filename):
    return "." in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def document_scanner(image_path, output_path):
    # Load the image
    image = cv.imread(image_path)
    orig = image.copy()
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    # Apply Gaussian blur and edge detection
    gray = cv.GaussianBlur(gray, (5, 5), 0)
    edged = cv.Canny(gray, 75, 200)

    # Find contours
    contours, _ = cv.findContours(edged.copy(), cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv.contourArea, reverse=True)[:5]

    # Look for a contour that approximates a rectangle
    for contour in contours:
        peri = cv.arcLength(contour, True)
        approx = cv.approxPolyDP(contour, 0.02 * peri, True)
        if len(approx) == 4:
            screen_contour = approx
            break
    else:
        return None  # No rectangle detected

    # Transform the perspective
    pts = screen_contour.reshape(4, 2)
    rect = np.zeros((4, 2), dtype="float32")

    # Determine the order of points: top-left, top-right, bottom-right, bottom-left
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]

    # Calculate the width and height of the new image
    (tl, tr, br, bl) = rect
    width_a = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    width_b = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    max_width = max(int(width_a), int(width_b))

    height_a = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    height_b = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    max_height = max(int(height_a), int(height_b))

    # Define the destination points for the perspective transform
    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1]], dtype="float32")

    # Perform the perspective transform
    matrix = cv.getPerspectiveTransform(rect, dst)
    warped = cv.warpPerspective(orig, matrix, (max_width, max_height))

    # Convert to grayscale and enhance
    warped = cv.cvtColor(warped, cv.COLOR_BGR2GRAY)
    _, scanned = cv.threshold(warped, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)

    # Save the scanned image
    cv.imwrite(output_path, scanned)
    return output_path


#########################################
# Routes
#########################################

# Test API Route
@app.route("/")
def welcome():
    return "Hello World"

@app.route('/upload', methods=['POST'])
def upload_file():
    # Check if a custom header (e.g., API-Token) is present to verify requests
    api_token = request.headers.get('X-Frontend-Token')
    if api_token != "your-secure-token":
        return jsonify({'error': 'Unauthorized access'}), 401

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

        # Perform document scanning
        transformed_filename = f"scanned_{filename}"
        transformed_path = os.path.join(app.config['TRANSFORMED_FOLDER'], transformed_filename)

        result = document_scanner(filepath, transformed_path)
        if result is None:
            return jsonify({'error': 'Could not detect a document in the image'}), 400

        return jsonify({'message': 'File uploaded and transformed successfully', 'filename': transformed_filename}), 200

    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/uploads/<name>')
def download_file(name):
    return send_from_directory(app.config["TRANSFORMED_FOLDER"], name)


if __name__ == "__main__":
    app.run(debug=False)
