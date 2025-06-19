import React, { useState } from 'react';

const FileUploader = () => {
  const [fileContent, setFileContent] = useState('');

  // Handler for file input
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Ensure a file is selected
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();

      // Define what happens when file is read
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
      };

      // Read the file as text
      reader.readAsText(file);
    } else {
      alert('Please upload a valid text file!');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
      />
      {fileContent && (
        <div>
          <h3>File Content:</h3>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
