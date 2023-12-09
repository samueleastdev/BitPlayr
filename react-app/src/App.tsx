import React, { useEffect } from 'react';
import './App.css';
import Bitplayr from './video/Bitplayr';

function App() {
  useEffect(() => {
    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  return <Bitplayr />;
}

export default App;
