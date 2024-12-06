# Document Processing Web App

  

## Project Overview

The **Document Processing Web App** is a tool designed to upload and process documents with ease. It allows users to upload images, and retrieve both processed images and extracted text files. The app supports functionality such as drag-and-drop uploads, previewing drafts and downloading results.
## Group Members

- Donald Xu
- Shanette Presas
- Hanna De Los Santos
- Ken Cheng
- Jersey To
---
## Features
1. **Auto Crop and Warp Image**
    - Automatically detects the edges of an image, crops it, and applies perspective warping for better alignment.
2. **Auto Extract Text**
    - Utilizes [Tesseract OCR](https://github.com/tesseract-ocr/tesseract/) to extract text from the processed image, enabling easy text retrieval and editing.
---
## Tech Stack
### **Frontend**
- **Framework**: React.js
- **CSS**: Tailwind CSS
- **HTTP Client**: Axios
### **Backend**
- **Framework**: Flask (Python)
- **Libraries**:
  - `os` for file handling
  - `send_from_directory` for file serving
- **Hosting**: Local server on `http://localhost:5000`
---
## Installation and Setup
### **Backend Setup**

1. Install [Tesseract OCR](https://github.com/tesseract-ocr/tesseract/)

2. Activate the virtual environment:

   ```
   .\venv\Scripts\activate
   ```

3. Run the Flask server:

   ```
   python server.py
   ```

   The server will be available at `http://localhost:5000`.
### **Frontend Setup**

1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the React development server:
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.
---
## API Endpoints
### **GET Endpoints**
`<name>` name of the document with file extension
- `http://localhost:5000/uploads/<name>`: Download processed output files.

- `http://localhost:5000/drafts/<name>`: Retrieve draft images.

- `http://localhost:5000/texts/<name>`: Retrieve text files.
### **DELETE Endpoint**
- `http://localhost:5000/delete`: Clears all session-related files from the backend.
---
## Usage

1. Launch both the frontend and backend servers.

2. Navigate to `http://localhost:3000`.

3. Upload an image file.

4. View draft previews and download processed outputs.

---

## Contributing

### Members:

- **Donald Xu**: Backend development and API implementation.
- **Shanette Presas**: Frontend UI/UX design and integration.
- **Hanna De Los Santos**: Testing, debugging, and documentation.
- **Ken Cheng**: Backend development and API implementation.
- **Jersey To**: Frontend UI/UX design and integration.
---
## Future Enhancements

- Support for additional file formats (e.g., PDFs).
- Temporary Cloud storage integration.
---
## License
This project is open-source and licensed under the MIT License.

---
![ui_2](https://github.com/user-attachments/assets/0baa94a5-1142-4dd0-828b-965aa8719b45)
![ui_1](https://github.com/user-attachments/assets/22ca82da-e6dc-4bb5-a40e-300c512bd0b9)
![ui-3](https://github.com/user-attachments/assets/c2ffdb80-525b-4e58-a9bd-860cc88cd07f)

