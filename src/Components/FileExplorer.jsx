import React, { useState } from "react";
import "./FileExplorer.css";

const FileExplorer = ({ data }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);

  const handleFileClick = (name) => {
    setSelectedFile(name);
  };

  const handleRightClick = (e, file) => {
    e.preventDefault();
    setCurrentFile(file);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentFile(null);
  };

  const handleAction = (action) => {
    if (currentFile) {
      console.log(`${currentFile.name} :  ${action}`);
      closeModal();
    }
  };

  const toggleFolderExpansion = (folderName) => {
    setExpandedFolders((prev) => {
      const newExpandedFolders = new Set(prev);
      //removing if already clicked on open one and also setting currentfile as null
      if (newExpandedFolders.has(folderName)) {
        setSelectedFile(null);
        newExpandedFolders.delete(folderName);
      } else {
        newExpandedFolders.add(folderName);
      }
      return newExpandedFolders;
    });
  };

  //current: current file or folder object
  //currentPath : keeps track of the path of the current folder
  const renderFileTree = (current, currentPath = "") => {
    const fullPath = currentPath
      ? `${currentPath}/${current.name}`
      : current.name;

    return (
      <div key={fullPath}>
        {current.type === "folder" ? (
          <div>
            <div
              className="folder-name"
              onClick={() => toggleFolderExpansion(fullPath)}
            >
              {expandedFolders.has(fullPath) ? "[v]" : "[>]"} {current.name}
            </div>
            {/* Check if the folder is expanded */}
            {expandedFolders.has(fullPath) && (
              <div className="folder-contents">
                {/* recursively calling renderFileTree to render the contents of the folder.*/}
                {current.data.map((child) => renderFileTree(child, fullPath))}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`file ${selectedFile === fullPath ? "selected" : ""}`}
            onClick={() => handleFileClick(fullPath)}
            onContextMenu={(e) => handleRightClick(e, current)}
          >
            {current.name}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="file-explorer">
      {renderFileTree(data)}

      {isModalOpen && currentFile && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal">
            <h3>File Actions</h3>
            <button onClick={() => handleAction("copy")}>Copy</button>
            <button onClick={() => handleAction("delete")}>Delete</button>
            <button onClick={() => handleAction("rename")}>Rename</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
