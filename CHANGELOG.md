# Changelog

All notable changes to Easy Photo Picker will be documented in this file.

## [1.0.0] - 2026-01-04

### 🎉 Initial Release

#### ✨ Features

**Core Functionality**
- Browse through photos one by one in full-screen view
- Three-way categorization: Select, Doubtful, Reject
- Automatic file copying to organized folders
- Native macOS folder picker for easy folder selection
- Support for all major image formats (JPG, JPEG, PNG, GIF, BMP, WEBP)

**User Interface**
- Clean, modern design with Tailwind CSS
- Gradient color scheme for visual appeal
- Responsive layout optimized for photo viewing
- Real-time progress tracking with visual progress bar
- Compact header design maximizing photo viewing space

**Smart Features**
- **Duplicate Detection**: Automatically skips files that already exist in destination
- **Undo Functionality**: Reverse your last categorization with Z key or button
- **Keyboard Shortcuts**: Lightning-fast navigation with arrow keys and letter shortcuts
- **Multi-Session Support**: Sort from multiple sources to same destination with aggregated stats

**Progress Tracking**
- Live counter showing current position and total images
- Real-time updates for Selected, Doubtful, and Rejected counts
- Visual progress bar with percentage completion

**Completion Summary**
- Detailed breakdown by category
- New files copied count
- Duplicates skipped count
- Total files in destination folders
- Source and destination folder paths for verification

**Keyboard Shortcuts**
- `→` or `S` - Select current photo
- `↓` or `D` - Mark as Doubtful  
- `←` or `R` - Reject current photo
- `Z` or `Cmd/Ctrl+Z` - Undo last action

#### 🏗️ Technical

**Architecture**
- React 18 frontend with Vite for fast development
- Electron 28 for native desktop experience
- Express.js backend for file operations
- electron-builder for macOS installer creation

**File Handling**
- Non-destructive operations (copies, not moves)
- Automatic folder creation (selected, doubtful, rejected)
- Safe duplicate handling to prevent overwrites
- Action history for undo functionality

**Platform Support**
- macOS Intel (x64) installer
- macOS Apple Silicon (arm64) installer
- Standalone .dmg files for easy distribution

#### 📦 Distribution

- Pre-built macOS installers (.dmg)
- Universal app supporting both Intel and Apple Silicon
- No code signing (requires right-click → Open on first launch)

#### 🎨 UI/UX Improvements

- Minimal header to maximize photo viewing area
- Color-coded buttons (Green=Select, Orange=Doubtful, Red=Reject)
- Disabled state for Undo button when no actions to undo
- Truncated folder paths with tooltips for long paths
- Responsive grid layout for completion summary

#### 🐛 Bug Fixes

- Fixed stats not displaying total count correctly
- Fixed image not showing fully in viewport
- Fixed progress bar calculation
- Fixed duplicate file detection and skipping
- Improved error handling for corrupt JPEG files

#### 📝 Documentation

- Comprehensive README with setup instructions
- Developer documentation for building from source
- End-user guide for installation and usage
- Troubleshooting section for common issues

---

## Future Enhancements (Planned)

- [ ] Windows and Linux support
- [ ] Batch operations (select/reject multiple)
- [ ] Custom keyboard shortcut configuration
- [ ] Dark mode support
- [ ] Image rotation/basic editing
- [ ] Filter by image dimensions or file size
- [ ] Export session statistics as CSV
- [ ] Code signing for easier installation

---

**Note**: This is the first stable release. Please report any issues or feature requests!
