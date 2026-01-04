import { useState, useRef } from 'react';

function Setup({ onSetupComplete }) {
  const [sourceFolder, setSourceFolder] = useState('');
  const [destinationFolder, setDestinationFolder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sourceFolderInputRef = useRef(null);
  const destinationFolderInputRef = useRef(null);

  const handleSourceFolderSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Get the path from the first file and extract directory
      const filePath = files[0].path || files[0].webkitRelativePath;
      if (filePath) {
        // Extract the parent directory path
        const pathParts = filePath.split('/');
        pathParts.pop(); // Remove the filename
        const folderPath = pathParts.join('/');
        
        // For electron or local file access, we can get the full path
        // Otherwise, we need to construct it from webkitRelativePath
        if (files[0].path) {
          const dirPath = files[0].path.substring(0, files[0].path.lastIndexOf('/'));
          setSourceFolder(dirPath);
        } else {
          setSourceFolder('/' + folderPath);
        }
      }
    }
  };

  const handleDestinationFolderSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const filePath = files[0].path || files[0].webkitRelativePath;
      if (filePath) {
        const pathParts = filePath.split('/');
        pathParts.pop();
        const folderPath = pathParts.join('/');
        
        if (files[0].path) {
          const dirPath = files[0].path.substring(0, files[0].path.lastIndexOf('/'));
          setDestinationFolder(dirPath);
        } else {
          setDestinationFolder('/' + folderPath);
        }
      }
    }
  };

  const browseSourceFolder = async () => {
    console.log('Browse source folder clicked');
    console.log('Electron available?', !!window.electron);
    // Check if Electron is available
    if (window.electron && window.electron.selectFolder) {
      try {
        const folderPath = await window.electron.selectFolder('source');
        console.log('Source folder selected:', folderPath);
        if (folderPath) {
          setSourceFolder(folderPath);
        }
      } catch (error) {
        console.error('Error selecting source folder:', error);
        setError('Failed to select folder: ' + error.message);
      }
    } else {
      console.log('Using fallback file input');
      // Fallback to web file input
      sourceFolderInputRef.current?.click();
    }
  };

  const browseDestinationFolder = async () => {
    console.log('Browse destination folder clicked');
    console.log('Electron available?', !!window.electron);
    // Check if Electron is available
    if (window.electron && window.electron.selectFolder) {
      try {
        const folderPath = await window.electron.selectFolder('destination');
        console.log('Destination folder selected:', folderPath);
        if (folderPath) {
          setDestinationFolder(folderPath);
        }
      } catch (error) {
        console.error('Error selecting destination folder:', error);
        setError('Failed to select folder: ' + error.message);
      }
    } else {
      console.log('Using fallback file input');
      // Fallback to web file input
      destinationFolderInputRef.current?.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceFolder, destinationFolder }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed');
      }

      if (data.totalImages === 0) {
        setError('No images found in the source folder');
        setLoading(false);
        return;
      }

      onSetupComplete({ sourceFolder, destinationFolder, totalImages: data.totalImages });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📸 Easy Photo Picker</h1>
          <p className="text-gray-600">Select and organize your photos with ease</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden file inputs for folder selection */}
          <input
            ref={sourceFolderInputRef}
            type="file"
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleSourceFolderSelect}
            className="hidden"
          />
          <input
            ref={destinationFolderInputRef}
            type="file"
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleDestinationFolderSelect}
            className="hidden"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source Folder
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={sourceFolder}
                onChange={(e) => setSourceFolder(e.target.value)}
                placeholder="/path/to/your/photos"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
              <button
                type="button"
                onClick={browseSourceFolder}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 whitespace-nowrap"
              >
                📁 Browse
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Click Browse to select or enter the full path to your source folder
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Folder
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={destinationFolder}
                onChange={(e) => setDestinationFolder(e.target.value)}
                placeholder="/path/to/destination"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
              <button
                type="button"
                onClick={browseDestinationFolder}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 whitespace-nowrap"
              >
                📁 Browse
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Images will be copied to 'selected', 'doubtful', and 'rejected' subfolders
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Loading...' : 'Start Picking Photos'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Browse through your photos one by one</li>
            <li>• Click "Select" to save photos you like</li>
            <li>• Click "Doubtful" for photos you're unsure about</li>
            <li>• Click "Reject" for photos you don't want</li>
            <li>• Photos will be copied to separate folders automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Setup;
