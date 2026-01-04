import { useState, useEffect } from 'react';
import Setup from './components/Setup';
import ImagePicker from './components/ImagePicker';

function App() {
  const [isSetup, setIsSetup] = useState(false);
  const [config, setConfig] = useState(null);

  const handleSetupComplete = (setupConfig) => {
    setConfig(setupConfig);
    setIsSetup(true);
  };

  const handleReset = () => {
    setIsSetup(false);
    setConfig(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isSetup ? (
        <Setup onSetupComplete={handleSetupComplete} />
      ) : (
        <ImagePicker config={config} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
