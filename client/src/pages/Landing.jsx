import { useState } from "react";
import { stacked_img } from "../assets";
import logo from "/logo.png";
import axios from "axios";
import { FaArrowAltCircleRight, FaPlus } from "react-icons/fa"
const Landing = () => {
  const [selectedFile, setSelectedFile] = useState(null); // Store File
  const [drawnFile, setDrawnFile] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [textFile, setTextFile] = useState("");
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [blobselectedFile, setBlobSelectedFile] = useState(null);

  const [uploadMessage, setUploadMessage] = useState("");
  

  const [uploadStatus, setUploadStatus] = useState(false);
 
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };


  const upload = () => {
    const formData = new FormData();
    formData.append('file',selectedFile);
    
    axios.post('http://localhost:5000/upload',formData).then(
      (res) => {
        console.log(res.data);
        setUploadStatus(true);
        // Retrieve all Files
        getDrawn();
        getOutput();
        getText();
        const mimeType = getMimeType(selectedFile.name);
        const blob = new Blob([selectedFile], { type: mimeType }); 
        const imageURL = URL.createObjectURL(blob); 
        setBlobSelectedFile(imageURL);

      }
    ).catch((err) => {
      console.error(err);

      setUploadMessage(err.response.data['error'] || err.message);
      setUploadStatus(false);
    })
  }

  const getMimeType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase(); 
    const mimeTypes = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
    };
  
    return mimeTypes[extension] || "application/octet-stream";// default binary
  };

  const getDrawn = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    const mimeType = getMimeType(selectedFile.name);
    axios
      .get(`http://localhost:5000/drafts/${selectedFile.name}`, {
        responseType: "arraybuffer", // Expect binary data
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: mimeType }); 
        const imageURL = URL.createObjectURL(blob); 
        setDrawnFile(imageURL); // Save the URL to state
      })
      .catch((err) => {
        console.error(err);
        setDrawnFile(null);
      });
  };
  
  const deleteFiles =() => {
    axios.delete(`http://localhost:5000/delete`).then((res)=>
     console.log(res.data)
    ).catch((err) => {
      console.error(err);
    })
  }
  
  const getOutput = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    const mimeType = getMimeType(selectedFile.name);
    axios
      .get(`http://localhost:5000/uploads/${selectedFile.name}`, {
        responseType: "arraybuffer", // Expect binary data
      })
      .then((res) => {
        const blob = new Blob([res.data], { type: mimeType }); 
        const imageURL = URL.createObjectURL(blob); 
        setOutputFile(imageURL); // Save the URL to state
      })
      .catch((err) => {
        console.error(err);
        setOutputFile(null);
      });
  };

  const getText = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    axios.get(`http://localhost:5000/texts/${selectedFile.name}`, {
    }).then( (res) => {
      setTextFile(res.data);
    }).catch( (err) => {
      console.error(err);
      setTextFile("");
    })
  }
  
  const downloadOutput = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
  
    const fileName = selectedFile.name;
  
    axios
      .get(`http://localhost:5000/uploads/${fileName}`, {
        responseType: "blob",
      })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data])); 
        const link = document.createElement("a"); 
        link.href = url;
        link.setAttribute("download", fileName); 
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link); // Clean up
      })
      .catch((err) => {
        console.error("Failed to download file:", err);
      });
  };

  const downloadText = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
  
    const fileName = selectedFile.name;
    const textFileName = `${selectedFile.name.split('.').slice(0, -1).join('.')}.txt`; 
    axios
    .get(`http://localhost:5000/texts/${fileName}`, {
      responseType: "text", 
    })
    .then((res) => {
      const blob = new Blob([res.data], { type: "text/plain" }); 
      const url = window.URL.createObjectURL(blob); 
      const link = document.createElement("a"); 
      link.href = url;
      link.setAttribute("download", textFileName); 
      document.body.appendChild(link);
      link.click(); 
      document.body.removeChild(link); // Clean up
    })
    .catch((err) => {
      console.error("Failed to download text file:", err);
    });
  };


  const restart = () => {
    setSelectedFile(null);
    setDrawnFile(null);
    setBlobSelectedFile(null);
    setOutputFile(null);
    setTextFile(null);
    setIsDragging(null);
    setUploadStatus(false);
    setUploadMessage("");
    deleteFiles();
  }


  return (
    <div>
    <div className="flex justify-center items-center flex-col">
      <div className="flex justify-center">
        <img src={logo} className="h-20" />
      </div>
      <div className="my-4">Crop your documents at the click of a button!</div>
      {!uploadStatus &&(
      <div className="flex justify-center">
        <div className={`flex py-10 px-36 justify-center items-center flex-col bg-base-300 border-2 border-dashed border-base-content border-opacity-40 rounded-xl
        ${
          isDragging ? "bg-opacity-40 border-primary" : ""
        }`} 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        >
          <p>Drag your image file here</p>
          <img src={stacked_img} className=" w-64" />
          <div className="inline-flex items-center justify-center w-full my-4">
            <hr className="relative h-px bg-base-content border-0 w-52 opacity-50"></hr>
            <p className="absolute px-2 bg-base-300 text-white font-bold">OR</p>
          </div>
          <p className="font-bold text-base mb-4">
            Upload your image file here
          </p>
          <input
            type="file"
            className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
            onChange={handleFileChange}
          />
          {selectedFile && (
            <div className="flex flex-col">
            <div className="mt-4 flex flex-row justify-center items-center">
            <div className="mr-10">
              <p className="truncate w-48">Selected File: {selectedFile.name}</p>
              <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <button className='btn bg-primary text-primary-content hover:bg-primary hover:bg-opacity-45' onClick={upload}>Upload</button>
            </div>
            <p className="text-center text-error font-bold mt-3">{uploadMessage}</p>
            </div>
          )}
        </div>
      
      </div>
      )}

      {uploadStatus &&(
        <div className="flex flex-col">
        <div className="mt-10 flex flex-row items-center space-x-8">
                      <div className="flex flex-col">
              <div className="text-center font-bold text-secondary">Original Image</div>

            {blobselectedFile ? (
              <img src={blobselectedFile} className="h-96"/>
            ) : (
              <p>No image to display</p>
            )}
           </div>
            <FaArrowAltCircleRight size={96} className="text-secondary"/>
            <div className="flex flex-col">
              <div className="text-center font-bold text-primary">Image Cropped</div>

              {drawnFile ? (
                <img src={drawnFile} className="h-96"/>
              ) : (
                <p>No image to display</p>
              )}
            </div>
            <FaArrowAltCircleRight size={96} className="text-primary"/>
            <div className="flex flex-col">
              <div className="text-center font-bold text-secondary">Result</div>

            {outputFile ? (
              <img src={outputFile} className="h-96"/>
            ) : (
              <p>No image to display</p>
            )}
            </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button className='btn bg-primary text-accent-content hover:bg-primary hover:bg-opacity-50 mr-10' onClick={downloadOutput}>Download Output File</button>
          <button className='btn bg-secondary text-accent-content hover:bg-secondary hover:bg-opacity-50' onClick={downloadText}>Download Extracted Text</button>
        </div>
        <div className="mt-3 flex justify-center">
          
          <button className='btn bg-gradient-to-r from-orange-500 to-pink-500 hover:from-pink-500 hover:to-orange-500 text-white hover:bg-secondary' onClick={restart}>
          Process New Image
          <FaPlus/>
          </button>
        </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Landing;
