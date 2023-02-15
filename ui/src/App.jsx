import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { uploadFile } from "./api/uploadFile";
import { API_URL } from "./api/config";
import { getFiles } from "./api/getFiles";
import { deleteFile } from "./api/deleteFile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [file, setFile] = useState();
  const [uploads, setUploads] = useState([]);
  
  function handleFileSelect(e) {
    setFile(e.target.files[0]);
  }

  async function handleFileDeletion(filename) {
    await deleteFile(filename);
    const updatedUploads = uploads.filter(upload => upload !== filename)
    setUploads(updatedUploads);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newFile = await uploadFile(file);
    setUploads([...uploads, newFile]);
  }

  useEffect(() => {
    getFiles().then((files) => {
      setUploads(files);
      setIsAuthenticated(true);
    });
  }, [uploads]);


  return (
    <div className="App">
      {!isAuthenticated ? (
        <a href={`${API_URL}/auth/google`}>login</a>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="file">File</label>
            <input onChange={handleFileSelect} id="file" type="file"></input>
            <button>upload</button>
          </form>
          <div className="files">
          {uploads.map((upload) => (
            <div key={upload._id}>
              <a href={`${API_URL}/files/${upload.filename}`}>
                {upload.filename}
              </a>
              <button className="delete" onClick={() => handleFileDeletion(upload.filename)}>
                delete
              </button>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;