import React, { useState, useRef, useEffect } from 'react';
import NavBarMinimal from './NavBar';
import DesignCanvas from './DesignCanvas';
import Directory, { FileSystemItem, DirectoryHandle } from './Directory';
import DisableDefaultZoom from './DisableZoom';

function App() {
  const [directoryStructure, setDirectoryStructure] = useState<FileSystemItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const directoryRef = useRef<DirectoryHandle>(null);

  useEffect(() => {
    const storedFileName = localStorage.getItem('selectedFileName');
    const storedFileContent = localStorage.getItem('selectedFileContent');
    if (storedFileName && storedFileContent) {
      setSelectedFileName(storedFileName);
      setSelectedFile(storedFileContent);
    }
  }, []);

  const handleFolderSelect = (folder: FileSystemItem[]) => {
    setDirectoryStructure(folder);
  };

  const handleFileSelect = (fileContent: string, fileName: string) => {
    setSelectedFile(fileContent);
    setSelectedFileName(fileName);
    localStorage.setItem('selectedFileName', fileName);
    localStorage.setItem('selectedFileContent', fileContent);
  };

  const handleIDEContentChange = (newContent: string) => {
    if (selectedFileName && directoryRef.current) {
      directoryRef.current.updateOpenEditorContent(selectedFileName, newContent);
    }
    setSelectedFile(newContent);
    localStorage.setItem('selectedFileContent', newContent);
  };

  return (
    <div className="App flex flex-col h-screen">
      <DisableDefaultZoom />
      <NavBarMinimal />
      <div className="flex-grow flex overflow-hidden">
        <Directory
          ref={directoryRef}
          items={directoryStructure}
          onFolderSelect={handleFolderSelect}
          onFileSelect={handleFileSelect}
        />
        <main className="flex-grow overflow-hidden">
          <DesignCanvas
            selectedFile={selectedFile}
            selectedFileName={selectedFileName}
            onCodeChange={handleIDEContentChange}
          />
        </main>
      </div>
    </div>
  );
}

export default App;