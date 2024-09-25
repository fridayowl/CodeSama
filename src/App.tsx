import React from 'react';
import NavBarMinimal from './NavBar';
import DesignCanvas from './DesignCanvas';

function App() {
  return (
    <div className="App flex flex-col h-screen">
      <NavBarMinimal />
      <main className="flex-grow overflow-hidden">
        <DesignCanvas />
      </main>
    </div>
  );
}

export default App;