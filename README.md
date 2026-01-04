# 📸 Easy Photo Picker

A beautiful, intuitive desktop application for quickly sorting through and organizing large photo collections. Built with React, Electron, and Express.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)

## ✨ Features

- 🖼️ **One-by-one photo browsing** - View each photo in full screen
- 🎯 **Three-way sorting** - Select, Doubtful, or Reject
- ⚡ **Keyboard shortcuts** - Lightning-fast navigation
- 🔄 **Undo functionality** - Easily reverse your last choice
- 📊 **Real-time progress tracking** - See your stats as you go
- 🔍 **Duplicate detection** - Automatically skips existing files
- 📈 **Detailed summaries** - View comprehensive completion reports
- 🎨 **Clean, modern UI** - Beautiful gradient design with Tailwind CSS
- 📁 **Native folder picker** - Easy folder selection with macOS dialogs

## 🚀 Quick Start

### For End Users (macOS)

1. **Download the installer:**
   - For Apple Silicon (M1/M2/M3): `Easy Photo Picker-1.0.0-arm64.dmg`
   - For Intel Macs: `Easy Photo Picker-1.0.0.dmg`

2. **Install:**
   - Double-click the `.dmg` file
   - Drag "Easy Photo Picker" to Applications folder
   - Right-click → Open (first time only, to bypass security)

3. **Use:**
   - Launch the app
   - Click Browse to select your source folder (photos to sort)
   - Click Browse to select your destination folder (where to save)
   - Click "Start Picking Photos"
   - Use buttons or keyboard shortcuts to sort!

### For Developers

#### Prerequisites
- Node.js 14+ 
- npm
- macOS (for building macOS apps)

#### Installation

```bash
git clone <repository-url>
cd easy-photo-picker
npm install
```

#### Development

```bash
# Start the Electron app in development mode
npm start

# Or run web version only (browser)
npm run dev
```

#### Build for Production

```bash
# Build macOS installer
./build-mac.sh

# Or manually
npm run dist:mac
```

The installer will be created in the `installable/` folder.

## 🎮 How to Use

### Setup Screen

1. **Source Folder**: Select the folder containing your photos to sort
2. **Destination Folder**: Select where sorted photos should be saved
3. Click **"Start Picking Photos"**

### Photo Sorting

**Three Categories:**
- **Select** (Green) - Photos you want to keep → `selected/` folder
- **Doubtful** (Orange) - Photos you're unsure about → `doubtful/` folder  
- **Reject** (Red) - Photos you don't want → `rejected/` folder

**Keyboard Shortcuts:**
- `→` or `S` - Select current photo
- `↓` or `D` - Mark as Doubtful
- `←` or `R` - Reject current photo
- `Z` or `Cmd/Ctrl+Z` - Undo last action

### Completion Summary

After sorting all photos, you'll see:
- **Category breakdown** - How many in each folder
- **New files copied** - Files added this session
- **Duplicates skipped** - Files that already existed
- **Total in destination** - Overall count across all folders

## 📂 Folder Structure

```
destination-folder/
├── selected/      # Photos you selected
├── doubtful/      # Photos you're unsure about
└── rejected/      # Photos you rejected
```

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Desktop**: Electron 28
- **Backend**: Express.js, Node.js
- **Builder**: electron-builder

## 📋 Features in Detail

### Multi-Session Support
- Sort from multiple source folders to the same destination
- Automatic duplicate detection across sessions
- Aggregated statistics show total counts

### Smart File Handling
- **Preserves originals** - Copies files, doesn't move them
- **Skips duplicates** - Won't overwrite existing files
- **Supports all image formats** - JPG, JPEG, PNG, GIF, BMP, WEBP

### Progress Tracking
- Current position / Total images
- Live counters for each category
- Visual progress bar
- Session-specific statistics

### Undo Support
- Undo your last categorization
- Removes file from destination
- Returns to previous image
- Updates all counters

## 🔧 Configuration

The app requires no configuration. Just select your folders and start sorting!

## 📝 Scripts

```bash
npm start              # Start Electron app (development)
npm run dev            # Start web version only
npm run build          # Build frontend
npm run build:mac      # Build macOS app (unpacked)
npm run dist:mac       # Build macOS installer (.dmg)
npm run clean          # Kill processes on ports 3000/3001
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run clean
```

### App Won't Open (macOS Security)
Right-click the app → Open → Open anyway

### Images Not Loading
- Check source folder permissions
- Ensure images are in supported formats
- Try restarting the app

## 📄 License

This project is available for personal use.

## 🙏 Acknowledgments

Built with ❤️ for photographers and photo enthusiasts who need to sort through hundreds of photos quickly and efficiently.

---

**Version 1.0.0** | Made with React, Electron, and Express
