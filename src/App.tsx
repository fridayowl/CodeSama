import React, { useState } from 'react';
import NavBarMinimal from './NavBar';
import DesignCanvas from './DesignCanvas';
import Directory, { FileSystemItem } from './Directory'; 
// import ReactFlowApp from './newversion/Canvas';
import DisableDefaultZoom from './DisableZoom'
function App() {
  const [directoryStructure, setDirectoryStructure] = useState<FileSystemItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFolderSelect = (folder: FileSystemItem[]) => {
    setDirectoryStructure(folder);
  };

  const handleFileSelect = (fileContent: string, fileName: string) => {
    setSelectedFile(fileContent);
    setSelectedFileName(fileName);
  };

  return (
    <div className="App flex flex-col h-screen">
      <DisableDefaultZoom />
      <NavBarMinimal />
      <div className="flex-grow flex overflow-hidden">
        <Directory
          items={directoryStructure}
          onFolderSelect={handleFolderSelect}
          onFileSelect={handleFileSelect}
        />
        <main className="flex-grow overflow-hidden">
          <DesignCanvas
            selectedFile={selectedFile}
            selectedFileName={selectedFileName}
          />
        </main>
      </div>
    </div> 
    // <ReactFlowApp/>
  );
}

export default App;