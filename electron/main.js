import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let server;

// Server setup - embedded in Electron
const PORT = 3001;
const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

let currentConfig = {
  sourceFolder: '',
  destinationFolder: '',
  images: [],
  currentIndex: 0,
  history: []
};

function startServer() {
  // Setup API routes
  setupAPIRoutes();
  
  server = expressApp.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  }).on('error', (err) => {
    console.error('Server error:', err);
  });
}

function setupAPIRoutes() {
  // Get list of images from source folder
  expressApp.post('/api/setup', async (req, res) => {
    try {
      const { sourceFolder, destinationFolder } = req.body;
      
      if (!sourceFolder || !destinationFolder) {
        return res.status(400).json({ error: 'Source and destination folders are required' });
      }

      const files = await fs.readdir(sourceFolder);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      });

      const selectedFolder = path.join(destinationFolder, 'selected');
      const doubtfulFolder = path.join(destinationFolder, 'doubtful');
      const rejectedFolder = path.join(destinationFolder, 'rejected');
      
      await fs.mkdir(selectedFolder, { recursive: true });
      await fs.mkdir(doubtfulFolder, { recursive: true });
      await fs.mkdir(rejectedFolder, { recursive: true });

      currentConfig = {
        sourceFolder,
        destinationFolder,
        images,
        currentIndex: 0,
        history: []
      };

      res.json({
        success: true,
        totalImages: images.length,
        message: `Found ${images.length} images`
      });
    } catch (error) {
      console.error('Setup error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get current image
  expressApp.get('/api/current-image', async (req, res) => {
    try {
      if (currentConfig.images.length === 0) {
        return res.status(400).json({ error: 'No images loaded. Please setup first.' });
      }

      if (currentConfig.currentIndex >= currentConfig.images.length) {
        return res.json({
          finished: true,
          message: 'All images processed!'
        });
      }

      const currentImage = currentConfig.images[currentConfig.currentIndex];
      const imagePath = path.join(currentConfig.sourceFolder, currentImage);
      
      const imageBuffer = await fs.readFile(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const ext = path.extname(currentImage).toLowerCase();
      const mimeType = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.webp': 'image/webp'
      }[ext] || 'image/jpeg';

      res.json({
        filename: currentImage,
        image: `data:${mimeType};base64,${base64Image}`,
        currentIndex: currentConfig.currentIndex,
        totalImages: currentConfig.images.length
      });
    } catch (error) {
      console.error('Current image error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Process image action
  expressApp.post('/api/process-image', async (req, res) => {
    try {
      const { action } = req.body;
      
      if (!['select', 'doubtful', 'reject', 'skip'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action' });
      }

      const currentImage = currentConfig.images[currentConfig.currentIndex];
      const sourcePath = path.join(currentConfig.sourceFolder, currentImage);

      currentConfig.history.push({
        index: currentConfig.currentIndex,
        filename: currentImage,
        action: action
      });

      if (action !== 'skip') {
        const folderName = action === 'select' ? 'selected' : action === 'doubtful' ? 'doubtful' : 'rejected';
        const destinationPath = path.join(currentConfig.destinationFolder, folderName, currentImage);
        
        await fs.copyFile(sourcePath, destinationPath);
      }

      currentConfig.currentIndex++;

      if (currentConfig.currentIndex >= currentConfig.images.length) {
        return res.json({
          success: true,
          finished: true,
          message: 'All images processed!'
        });
      }

      res.json({
        success: true,
        finished: false
      });
    } catch (error) {
      console.error('Process image error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Undo last action
  expressApp.post('/api/undo', async (req, res) => {
    try {
      if (currentConfig.history.length === 0) {
        return res.status(400).json({ error: 'Nothing to undo' });
      }

      const lastAction = currentConfig.history.pop();
      
      if (lastAction.action !== 'skip') {
        const folderName = lastAction.action === 'select' ? 'selected' : 
                          lastAction.action === 'doubtful' ? 'doubtful' : 'rejected';
        const destinationPath = path.join(currentConfig.destinationFolder, folderName, lastAction.filename);
        
        try {
          await fs.unlink(destinationPath);
        } catch (err) {
          console.error('Error deleting file during undo:', err);
        }
      }

      currentConfig.currentIndex = lastAction.index;

      res.json({
        success: true,
        canUndo: currentConfig.history.length > 0
      });
    } catch (error) {
      console.error('Undo error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get stats
  expressApp.get('/api/stats', async (req, res) => {
    try {
      const selectedFolder = path.join(currentConfig.destinationFolder, 'selected');
      const doubtfulFolder = path.join(currentConfig.destinationFolder, 'doubtful');
      const rejectedFolder = path.join(currentConfig.destinationFolder, 'rejected');

      let selected = 0, doubtful = 0, rejected = 0;

      try {
        const selectedFiles = await fs.readdir(selectedFolder);
        selected = selectedFiles.length;
      } catch (err) { }

      try {
        const doubtfulFiles = await fs.readdir(doubtfulFolder);
        doubtful = doubtfulFiles.length;
      } catch (err) { }

      try {
        const rejectedFiles = await fs.readdir(rejectedFolder);
        rejected = rejectedFiles.length;
      } catch (err) { }

      const processed = selected + doubtful + rejected;
      const remaining = currentConfig.images.length - currentConfig.currentIndex;

      res.json({
        currentIndex: currentConfig.currentIndex,
        total: currentConfig.images.length,
        totalImages: currentConfig.images.length,
        selected,
        doubtful,
        rejected,
        processed,
        remaining
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get summary
  expressApp.get('/api/summary', async (req, res) => {
    try {
      const stats = await new Promise((resolve) => {
        expressApp.handle({
          method: 'GET',
          url: '/api/stats'
        }, {
          json: (data) => resolve(data),
          status: () => ({ json: (data) => resolve(data) })
        });
      });

      res.json({
        totalProcessed: stats.processed,
        selected: stats.selected,
        doubtful: stats.doubtful,
        rejected: stats.rejected,
        skipped: stats.processed - (stats.selected + stats.doubtful + stats.rejected)
      });
    } catch (error) {
      console.error('Summary error:', error);
      res.status(500).json({ error: error.message });
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the Vite dev server in development or built files in production
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, dist is at the app root level
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading file from:', indexPath);
    mainWindow.loadFile(indexPath);
  }
}

// Handle folder selection dialog
ipcMain.handle('select-folder', async (event, type) => {
  console.log('IPC: select-folder called with type:', type);
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'createDirectory'],
    title: type === 'source' ? 'Select Source Folder' : 'Select Destination Folder'
  });

  console.log('Dialog result:', result);
  
  if (!result.canceled && result.filePaths.length > 0) {
    console.log('Returning folder path:', result.filePaths[0]);
    return result.filePaths[0];
  }
  console.log('Folder selection canceled');
  return null;
});

app.whenReady().then(() => {
  startServer();
  
  // Give server a moment to start before creating window
  setTimeout(() => {
    createWindow();
  }, 500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Close server when app closes
  if (server) {
    server.close();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  // Ensure server is closed on quit
  if (server) {
    server.close();
  }
});
