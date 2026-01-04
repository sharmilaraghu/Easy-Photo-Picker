import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let currentConfig = {
  sourceFolder: '',
  destinationFolder: '',
  images: [],
  currentIndex: 0,
  history: [] // Track actions for undo functionality
};

// Get list of images from source folder
app.post('/api/setup', async (req, res) => {
  try {
    const { sourceFolder, destinationFolder } = req.body;
    
    if (!sourceFolder || !destinationFolder) {
      return res.status(400).json({ error: 'Source and destination folders are required' });
    }

    // Read all files from source folder
    const files = await fs.readdir(sourceFolder);
    
    // Filter only image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const images = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Create selected, doubtful, and rejected folders if they don't exist
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
app.get('/api/current-image', async (req, res) => {
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
    
    // Read image as base64
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
      image: `data:${mimeType};base64,${base64Image}`,
      filename: currentImage,
      currentIndex: currentConfig.currentIndex + 1,
      totalImages: currentConfig.images.length,
      finished: false
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Select, doubtful, or reject image
app.post('/api/process-image', async (req, res) => {
  try {
    const { action } = req.body; // 'select', 'doubtful', or 'reject'
    
    if (!['select', 'doubtful', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    if (currentConfig.currentIndex >= currentConfig.images.length) {
      return res.status(400).json({ error: 'No more images to process' });
    }

    const currentImage = currentConfig.images[currentConfig.currentIndex];
    const sourcePath = path.join(currentConfig.sourceFolder, currentImage);
    
    let targetFolder;
    if (action === 'select') {
      targetFolder = path.join(currentConfig.destinationFolder, 'selected');
    } else if (action === 'doubtful') {
      targetFolder = path.join(currentConfig.destinationFolder, 'doubtful');
    } else {
      targetFolder = path.join(currentConfig.destinationFolder, 'rejected');
    }
    
    const targetPath = path.join(targetFolder, currentImage);

    // Copy file to target folder
    await fs.copyFile(sourcePath, targetPath);

    // Track this action for undo
    currentConfig.history.push({
      filename: currentImage,
      action: action,
      index: currentConfig.currentIndex,
      targetPath: targetPath
    });

    // Move to next image
    currentConfig.currentIndex++;

    res.json({
      success: true,
      action,
      filename: currentImage,
      remaining: currentConfig.images.length - currentConfig.currentIndex
    });
  } catch (error) {
    console.error('Process image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Undo last action
app.post('/api/undo', async (req, res) => {
  try {
    if (currentConfig.history.length === 0) {
      return res.status(400).json({ error: 'Nothing to undo' });
    }

    // Get the last action
    const lastAction = currentConfig.history.pop();

    // Delete the file from destination folder
    try {
      await fs.unlink(lastAction.targetPath);
    } catch (err) {
      console.error('Failed to delete file during undo:', err);
      // Continue anyway - maybe file doesn't exist
    }

    // Go back to that image
    currentConfig.currentIndex = lastAction.index;

    res.json({
      success: true,
      message: 'Action undone',
      currentIndex: currentConfig.currentIndex
    });
  } catch (error) {
    console.error('Undo error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const selectedFolder = path.join(currentConfig.destinationFolder, 'selected');
    const doubtfulFolder = path.join(currentConfig.destinationFolder, 'doubtful');
    const rejectedFolder = path.join(currentConfig.destinationFolder, 'rejected');
    
    const selectedFiles = await fs.readdir(selectedFolder).catch(() => []);
    const doubtfulFiles = await fs.readdir(doubtfulFolder).catch(() => []);
    const rejectedFiles = await fs.readdir(rejectedFolder).catch(() => []);

    res.json({
      total: currentConfig.images.length,
      processed: currentConfig.currentIndex,
      selected: selectedFiles.length,
      doubtful: doubtfulFiles.length,
      rejected: rejectedFiles.length,
      remaining: currentConfig.images.length - currentConfig.currentIndex
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
    console.error('You can kill the process using: lsof -ti:3001 | xargs kill -9');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
