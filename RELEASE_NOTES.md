# Easy Photo Picker v1.0.0 - Release Notes

**Release Date**: January 4, 2026

## 🎉 Welcome to Easy Photo Picker!

We're excited to introduce Easy Photo Picker, a beautiful desktop application designed to help photographers, event planners, and photo enthusiasts quickly sort through large collections of photos.

## 🌟 What is Easy Photo Picker?

Easy Photo Picker is a native macOS application that lets you browse through hundreds or thousands of photos one at a time and quickly categorize them into three folders:
- **Selected** - Photos you love
- **Doubtful** - Photos you're unsure about  
- **Rejected** - Photos you don't want

## 🚀 Key Features

### Smart & Fast
- **One-click sorting** with beautiful, intuitive buttons
- **Keyboard shortcuts** for lightning-fast workflows
- **Undo button** to reverse mistakes instantly
- **Real-time progress** tracking as you work

### Intelligent File Management
- **Duplicate detection** - Never overwrites existing files
- **Multi-session support** - Sort from multiple sources to same destination
- **Original files preserved** - Only copies, never moves
- **Automatic folder creation** - Sets up your destination structure

### Beautiful Experience
- **Full-screen photo viewing** maximizes your workspace
- **Clean, modern interface** with gradient design
- **Native macOS integration** with folder picker dialogs
- **Responsive layout** optimized for photo viewing

### Detailed Insights
- **Completion summaries** show exactly what was copied
- **Duplicate tracking** tells you what was skipped
- **Session statistics** track all your progress
- **Source verification** shows where photos came from

## 📥 Installation

### System Requirements
- macOS 10.12 or later
- 50 MB free disk space

### Download & Install

1. **Choose your installer:**
   - Apple Silicon (M1/M2/M3): Download `Easy Photo Picker-1.0.0-arm64.dmg`
   - Intel Macs: Download `Easy Photo Picker-1.0.0.dmg`

2. **Install:**
   - Double-click the downloaded `.dmg` file
   - Drag "Easy Photo Picker" to your Applications folder
   
3. **First Launch:**
   - Right-click the app in Applications
   - Select "Open"
   - Click "Open" in the security dialog
   - (Only needed the first time)

## 🎮 Quick Start Guide

### Step 1: Setup
1. Launch Easy Photo Picker
2. Click "📁 Browse" next to Source Folder
3. Select the folder containing photos you want to sort
4. Click "📁 Browse" next to Destination Folder  
5. Select where you want sorted photos saved
6. Click "Start Picking Photos"

### Step 2: Sort Photos
Use either **buttons** or **keyboard shortcuts**:

| Action | Button | Keyboard |
|--------|--------|----------|
| Select | Green ✓ | → or S |
| Doubtful | Orange ? | ↓ or D |
| Reject | Red ✗ | ← or R |
| Undo | ↶ Undo | Z or Cmd+Z |

### Step 3: Review Summary
When finished, see:
- How many photos in each category
- How many new files were copied
- How many duplicates were skipped
- Total files in your destination

## 💡 Use Cases

### Event Photography
Sort through hundreds of event photos quickly, keeping the best shots and marking uncertain ones for later review.

### Photo Culling
Quickly eliminate bad shots from photo shoots, keeping only your favorites and maybes.

### Album Creation
Organize photos from multiple sources into one destination, with automatic duplicate detection.

### Digital Decluttering
Clean up your photo library by going through old folders and deciding what to keep.

## 🎯 Pro Tips

1. **Use keyboard shortcuts** - Much faster than clicking!
2. **Mark doubtful for later** - Don't overthink, you can review doubtful photos again
3. **Multiple sessions** - Sort different event folders to the same destination
4. **Check the summary** - Verify all files were copied correctly

## 🔒 Privacy & Security

- **100% offline** - No internet connection required
- **No data collection** - Your photos stay on your computer
- **No analytics** - We don't track anything
- **Original files safe** - Only copies, never moves or deletes

## 🐛 Known Issues

- **macOS Security Warning**: App is not code-signed, so you'll see a security warning on first launch. Just right-click → Open to proceed.
- **Font Warnings in Console**: Harmless CoreText warnings may appear in developer console.
- **Corrupt JPEG Warnings**: Some JPEGs with minor corruption display fine but show console warnings.

## 📞 Support

### Troubleshooting

**App won't open:**
- Right-click the app → Select "Open"
- Go to System Preferences → Security → Allow the app

**Images not loading:**
- Check folder permissions
- Ensure images are in supported formats (JPG, PNG, GIF, BMP, WEBP)

**Port already in use (developers):**
- Run `npm run clean` to kill existing processes

## 🛠️ For Developers

### Build from Source
```bash
git clone <repository-url>
cd easy-photo-picker
npm install
npm start  # Development mode
./build-mac.sh  # Build installer
```

### Tech Stack
- React 18 + Vite
- Electron 28
- Express.js
- Tailwind CSS
- electron-builder

## 🙏 Thank You!

Thank you for using Easy Photo Picker! We hope it makes your photo sorting workflow faster and more enjoyable.

If you have feedback or feature requests, please let us know!

---

**Version**: 1.0.0  
**Release Date**: January 4, 2026  
**Platform**: macOS (Intel & Apple Silicon)  
**Size**: ~250-260 MB  
**License**: Personal Use

Made with ❤️ for photographers and photo enthusiasts.
