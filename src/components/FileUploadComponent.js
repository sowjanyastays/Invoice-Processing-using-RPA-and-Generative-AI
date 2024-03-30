import React, { Component } from "react";
import axios from "axios";
import "./FileUploadComponent.css"; // Import the CSS file for styling

class FileUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: [],
      filePreviews: [],
      excelFileUrl: "", // To store the URL of the downloaded Excel file
    };
  }

  handleDelete = (index) => {
    const updatedSelectedFiles = [...this.state.selectedFiles];
    const updatedFilePreviews = [...this.state.filePreviews];

    updatedSelectedFiles.splice(index, 1);
    updatedFilePreviews.splice(index, 1);

    this.setState({
      selectedFiles: updatedSelectedFiles,
      filePreviews: updatedFilePreviews,
    });
  };

  handleFileChange = (e) => {
    const newSelectedFiles = Array.from(e.target.files);
    this.setState((prevState) => ({
      selectedFiles: [...prevState.selectedFiles, ...newSelectedFiles],
    }));

    const filePreviews = newSelectedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(filePreviews).then((previews) => {
      this.setState((prevState) => ({
        filePreviews: [...prevState.filePreviews, ...previews],
      }));
    });
  };

  handleExtractData = async () => {
    console.log('here')
    try {
      const formData = new FormData();
      this.state.selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      console.log(formData)

      const response = await axios.post("http://localhost:5000/upload", formData, {
        responseType: "blob", // Ensure the response is treated as a blob
      });

      const excelFile = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const excelFileUrl = URL.createObjectURL(excelFile);

      this.setState({ excelFileUrl });
    } catch (error) {
      console.error("Error:", error);
      // Handle error state or feedback to the user
    }
  };

  render() {
    const { filePreviews, excelFileUrl } = this.state;

    return (
      <div className="file-upload-container">
        <div className="preview-container">
          <div className="file-previews">
            {filePreviews.map((preview, index) => (
              <div key={index} className="file-preview">
                <img src={preview} alt={`Preview ${index}`} />
                <p>{this.state.selectedFiles[index].name}</p>
                <i
                  className="bi bi-trash float-right"
                  onClick={() => this.handleDelete(index)}
                ></i>
              </div>
            ))}
          </div>
        </div>
        <div className="browse-logo">
          <div className="upload-logo">
            <label htmlFor="fileInput">
              <img src="upload-logo.png" alt="Browse" />
              <div className="file-up"><p>Upload files</p></div>
            </label>
          </div>
          <input
            id="fileInput"
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={this.handleFileChange}
          />
        </div>
        <button className="extract-button" onClick={this.handleExtractData}>Extract data</button>
        {excelFileUrl && (
          <div>
            <p>Download your Excel file:</p>
            <a href={excelFileUrl} download="extracted_data.xlsx">
              <button>Download Excel</button>
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default FileUploadComponent;
