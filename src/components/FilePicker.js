// FilePicker.js
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const FilePicker = ({ onFileSelected }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      // Do something with the selected files
      if (onFileSelected) {
        onFileSelected(acceptedFiles);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-dashed border-2 border-gray-400 p-2 rounded-md text-center ${
        isDragActive ? "bg-gray-200" : "bg-white"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-gray-600">Drag and drop or click to select files</p>
    </div>
  );
};

export default FilePicker;
