# 📸 Easy Photo Picker

A modern, clean Vite React application to help you quickly sort through and organize your photos.

## Features

- 🖼️ Browse through images one by one
- ✅ Select or reject images with a single click
- ⌨️ Keyboard shortcuts for faster workflow (Arrow keys or S/R)
- 📊 Real-time progress tracking
- 📁 Automatic organization into 'selected' and 'rejected' folders
- 🎨 Beautiful, modern UI with Tailwind CSS

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

### Web Mode (Browser Only)

1. Start the application:
```bash
npm run dev
```

2. The app will open in your browser at `http://localhost:3000`

3. Click the "📁 Browse" button to select folders or enter paths manually:
   - **Source folder**: Where your images are located
   - **Destination folder**: Where selected/rejected folders will be created

4. Click "Start Picking Photos"

### Electron Mode (Native Desktop App - Recommended)

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the Electron app:
```bash
npm run electron:dev
```

3. Use the native folder picker dialogs by clicking "📁 Browse" buttons

4. Select or reject images with buttons or keyboard shortcuts

## How to Use

1. Click the "📁 Browse" button next to Source Folder (or type the path manually)

2. Click the "📁 Browse" button next to Destination Folder (or type the path manually)

3. Click "Start Picking Photos"

4. Use the buttons or keyboard shortcuts to select or reject images:
   - **Select**: Click the green button, press → (right arrow), or press 'S'
   - **Reject**: Click the red button, press ← (left arrow), or press 'R'

## How It Works

- The backend server (Express) reads images from your source folder
- Images are displayed one at a time in the browser
- When you select or reject an image, it's copied to the appropriate folder:
  - `[destination]/selected/` - for selected images
  - `[destination]/doubtful/` - for doubtful images
- Progress is tracked and displayed in real-time

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **File Operations**: Node.js fs module

## Keyboard Shortcuts

- `→` or `S` - Select current image
- `←` or `R` - Reject current image

## Requirements

- Node.js 14+ 
- Modern web browser

## Notes

- Supported image formats: JPG, JPEG, PNG, GIF, BMP, WEBP
- Images are copied (not moved) to preserve originals
- The app creates 'selected' and 'doubtful' subfolders automatically
