import React, { useState } from 'react';
import NavBarMinimal from './NavBar';
import DesignCanvas from './DesignCanvas';
import Directory, { FileSystemItem } from './Directory';

function App() {
  const [directoryStructure, setDirectoryStructure] = useState<FileSystemItem[]>([]);

  const handleFolderSelect = (folder: FileSystemItem[]) => {
    setDirectoryStructure(folder);
  };

  return (
    <div className="App flex flex-col h-screen">
      <NavBarMinimal />
      <div className="flex-grow flex overflow-hidden">
        <Directory items={directoryStructure} onFolderSelect={handleFolderSelect} />
        <main className="flex-grow overflow-hidden">
          <DesignCanvas />
        </main>
      </div>
    </div>
  );
}

export default App;