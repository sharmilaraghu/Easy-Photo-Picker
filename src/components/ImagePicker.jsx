import { useState, useEffect } from 'react';

function ImagePicker({ config, onReset }) {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    currentIndex: 0,
    totalImages: config?.totalImages || 0,
    total: config?.totalImages || 0,
    selected: 0,
    doubtful: 0,
    rejected: 0,
    processed: 0,
    remaining: config?.totalImages || 0
  });
  const [finished, setFinished] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const loadCurrentImage = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/current-image');
      const data = await response.json();

      if (data.finished) {
        setFinished(true);
        setLoading(false);
        await loadStats();
        return;
      }

      setCurrentImage(data);
      setStats(prev => ({
        ...prev,
        currentIndex: data.currentIndex,
        totalImages: data.totalImages || prev.totalImages || prev.total
      }));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      const data = await response.json();
      setStats({
        ...data,
        totalImages: data.total || data.totalImages || config?.totalImages || 0
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleAction = async (action) => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/process-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

      // Update stats immediately
      setStats(prev => ({
        ...prev,
        [action === 'select' ? 'selected' : 'rejected']: prev[action === 'select' ? 'selected' : 'rejected'] + 1,
        currentIndex: prev.currentIndex
      }));

      // Load next image
      await loadCurrentImage();
      
      // Refresh stats from server to ensure accuracy
      await loadStats();
      
      setCanUndo(true);
      setProcessing(false);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  const handleUndo = async () => {
    setProcessing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/undo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to undo');
      }

      // Reload the current (previous) image
      await loadCurrentImage();
      await loadStats();
      
      setProcessing(false);
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  useEffect(() => {
    loadStats().then(() => loadCurrentImage());
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (processing || finished) return;
      
      // Undo with Z key or Ctrl+Z
      if ((e.key === 'z' || e.key === 'Z') && !e.ctrlKey && !e.metaKey) {
        if (canUndo) handleUndo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) handleUndo();
        return;
      }
      
      if (e.key === 'ArrowRight' || e.key === 's' || e.key === 'S') {
        handleAction('select');
      } else if (e.key === 'ArrowDown' || e.key === 'd' || e.key === 'D') {
        handleAction('doubtful');
      } else if (e.key === 'ArrowLeft' || e.key === 'r' || e.key === 'R') {
        handleAction('reject');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [processing, finished, canUndo]);

  if (finished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">All Done!</h2>
          <p className="text-gray-600 mb-8">You've processed all {stats.total} images</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{stats.selected}</div>
              <div className="text-green-700">Selected</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{stats.doubtful}</div>
              <div className="text-orange-700">Doubtful</div>
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-red-700">Rejected</div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition duration-200 transform hover:scale-105"
          >
            Start New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-2">
        {/* Folder Paths Info */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-2">
          <div className="flex flex-col md:flex-row gap-1 text-xs">
            <div className="flex-1 min-w-0">
              <span className="text-gray-500">Source:</span>
              <span className="ml-1 font-medium text-gray-800 truncate block" title={config.sourceFolder}>
                📂 {config.sourceFolder}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-gray-500">Output:</span>
              <span className="ml-1 font-medium text-gray-800 truncate block" title={config.destinationFolder}>
                📁 {config.destinationFolder}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Header */}
        <div className="bg-white rounded-lg shadow-sm p-2 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-3">
            <div className="whitespace-nowrap">
              <span className="text-gray-600">Progress:</span>
              <span className="ml-1 font-semibold text-gray-800">
                {stats.currentIndex || stats.processed || 0} / {stats.totalImages || stats.total || 0}
              </span>
            </div>
            <div className="whitespace-nowrap">
              <span className="text-green-600 font-semibold">✓ {stats.selected || 0}</span>
              <span className="mx-1 text-gray-400">|</span>
              <span className="text-orange-600 font-semibold">? {stats.doubtful || 0}</span>
              <span className="mx-1 text-gray-400">|</span>
              <span className="text-red-600 font-semibold">✗ {stats.rejected || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo || processing}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ↶ Undo (Z)
            </button>
            <button
              onClick={onReset}
              className="text-xs text-gray-600 hover:text-gray-800 underline"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-1 bg-gray-200 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(stats.currentIndex / stats.totalImages) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto pb-2">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading image...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
            {/* Image Display */}
            <div className="relative bg-gray-900 flex items-center justify-center flex-1" style={{ minHeight: '300px', overflow: 'hidden' }}>
              <img
                src={currentImage?.image}
                alt={currentImage?.filename}
                className="w-full h-full object-contain"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
              {processing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-2 bg-white flex-shrink-0">
              <div className="text-center mb-2">
                <h3 className="text-xs font-medium text-gray-700 truncate">{currentImage?.filename}</h3>
              </div>

              <div className="flex gap-2 max-w-2xl mx-auto">
                <button
                  onClick={() => handleAction('reject')}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-3 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-lg mr-1">✗</span>
                    <span>Reject</span>
                  </div>
                  <div className="text-xs opacity-75">← or R</div>
                </button>

                <button
                  onClick={() => handleAction('doubtful')}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 px-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-lg mr-1">?</span>
                    <span>Doubtful</span>
                  </div>
                  <div className="text-xs opacity-75">↓ or D</div>
                </button>

                <button
                  onClick={() => handleAction('select')}
                  disabled={processing}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-lg mr-1">✓</span>
                    <span>Select</span>
                  </div>
                  <div className="text-xs opacity-75">→ or S</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePicker;
