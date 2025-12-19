# Sprint 7: Electron Desktop Application

## Overview
Package the transcript parser web application as a native desktop application using Electron, allowing users to download and run it as a standalone .exe (Windows), .dmg (macOS), or .AppImage (Linux) file.

## Goals
- Create an Electron wrapper around the existing React/Vite application
- Support Windows, macOS, and Linux builds
- Maintain all PWA features (offline support, IndexedDB storage)
- Enable local file system access for video files
- Auto-update functionality for future releases
- Native system tray integration
- Package and distribute via GitHub Releases

## Technical Stack
- **Electron**: Desktop application framework
- **electron-builder**: Build and package tool
- **electron-updater**: Auto-update functionality
- Existing Vite + React + TypeScript stack

## Features

### Core Features
1. **Native Desktop App**
   - Window management (minimize, maximize, close)
   - Native menu bar
   - System tray icon
   - Custom application icon

2. **File System Integration**
   - Native file picker for video selection
   - Drag-and-drop video files onto app window
   - Save transcripts directly to file system
   - Recent files list

3. **Native Features**
   - Desktop notifications for transcription completion
   - Native context menus
   - Keyboard shortcuts
   - Deep linking support (transcript:// protocol)

4. **Auto-Updates**
   - Check for updates on startup
   - Download and install updates in background
   - Notify user when update is ready

5. **Offline-First**
   - All PWA features work offline
   - Local IndexedDB for transcript storage
   - No internet required (except for Gemini API calls)

## Implementation Plan

### Phase 1: Electron Setup (1-2 hours)
- [ ] Install Electron dependencies
- [ ] Create Electron main process (electron/main.js)
- [ ] Configure Electron with Vite
- [ ] Set up IPC (Inter-Process Communication)
- [ ] Create build scripts for development

### Phase 2: Native Integration (2-3 hours)
- [ ] Implement native file picker
- [ ] Add drag-and-drop support
- [ ] Create native menu bar
- [ ] Add system tray icon
- [ ] Implement window state management
- [ ] Add keyboard shortcuts

### Phase 3: Build & Package (1-2 hours)
- [ ] Configure electron-builder
- [ ] Set up code signing (optional)
- [ ] Create application icons (icns, ico, png)
- [ ] Configure Windows installer
- [ ] Configure macOS DMG
- [ ] Configure Linux AppImage

### Phase 4: Auto-Updates (1 hour)
- [ ] Implement electron-updater
- [ ] Configure update server (GitHub Releases)
- [ ] Add update notification UI
- [ ] Test update flow

### Phase 5: Distribution (1 hour)
- [ ] Set up GitHub Actions for builds
- [ ] Create release workflow
- [ ] Generate installers for all platforms
- [ ] Create download page
- [ ] Add installation instructions

## File Structure
```
transcript-parser/
├── electron/
│   ├── main.js              # Main Electron process
│   ├── preload.js           # Preload script (security)
│   └── menu.js              # Native menu configuration
├── electron-builder.json    # Build configuration
├── resources/               # Application icons
│   ├── icon.icns           # macOS icon
│   ├── icon.ico            # Windows icon
│   └── icon.png            # Linux icon
├── .github/workflows/
│   └── electron-build.yml  # CI/CD for builds
└── package.json            # Updated scripts
```

## Dependencies to Add
```json
{
  "devDependencies": {
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0",
    "electron-updater": "^6.1.0",
    "concurrently": "^8.2.0",
    "wait-on": "^7.2.0"
  }
}
```

## NPM Scripts
```json
{
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:build:win": "npm run build && electron-builder --win",
    "electron:build:mac": "npm run build && electron-builder --mac",
    "electron:build:linux": "npm run build && electron-builder --linux",
    "electron:build:all": "npm run build && electron-builder -mwl"
  }
}
```

## Benefits

### For Users
- No browser required
- Native desktop experience
- Faster startup times
- Direct file system access
- Works completely offline
- Auto-updates
- Professional application feel

### For Distribution
- Single executable download
- Easy installation
- Cross-platform support
- Automatic updates
- Professional branding

## Security Considerations
- Context isolation enabled
- Node integration disabled in renderer
- Preload script for secure IPC
- Content Security Policy
- Signed executables (Windows/macOS)

## Testing Checklist
- [ ] Test on Windows 10/11
- [ ] Test on macOS (Intel & Apple Silicon)
- [ ] Test on Ubuntu/Linux
- [ ] Test file drag-and-drop
- [ ] Test native file picker
- [ ] Test offline functionality
- [ ] Test auto-updates
- [ ] Test installation/uninstallation
- [ ] Verify code signing
- [ ] Check for memory leaks

## Distribution Platforms
1. **GitHub Releases** (Free)
   - Host .exe, .dmg, .AppImage files
   - Auto-update support
   - Version management

2. **Microsoft Store** (Optional)
   - Professional distribution
   - Automatic updates
   - Requires developer account ($19)

3. **Mac App Store** (Optional)
   - Professional distribution
   - Requires Apple Developer account ($99/year)

4. **Snapcraft** (Linux)
   - Free distribution for Linux
   - Automatic updates

## Estimated Timeline
- **Total Time**: 6-9 hours
- **Complexity**: Medium
- **Dependencies**: None (can start immediately)

## Success Metrics
- [ ] Successfully build .exe for Windows
- [ ] Successfully build .dmg for macOS
- [ ] Successfully build .AppImage for Linux
- [ ] All PWA features work in desktop app
- [ ] File drag-and-drop works
- [ ] Auto-updates work
- [ ] Application < 200MB in size
- [ ] Startup time < 3 seconds

## Future Enhancements
- Windows/macOS system integration (Quick Look, etc.)
- Global keyboard shortcuts
- Menu bar app mode (macOS)
- Background service for video processing
- Multiple window support
- Plugin system for custom exporters

## Notes
- Electron adds ~100MB to app size (acceptable for desktop apps)
- Can reuse 100% of existing React/Vite code
- PWA and desktop app can coexist
- Consider offering both web and desktop versions
