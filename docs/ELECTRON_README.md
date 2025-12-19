# Transcript Parser - Desktop Application

Desktop version of the Transcript Parser built with Electron.

## Development

### Run in Development Mode

```bash
npm run electron:dev
```

This will:

1. Start the Vite dev server
2. Wait for it to be ready
3. Launch Electron pointing to the dev server

### Build Standalone Executables

#### Windows

```bash
npm run electron:build:win
```

Generates:

- `release/Transcript Parser-Setup-1.0.0.exe` - Installer
- `release/Transcript Parser-Portable-1.0.0.exe` - Portable version

#### macOS

```bash
npm run electron:build:mac
```

Generates:

- `release/Transcript Parser-1.0.0.dmg` - DMG installer
- `release/Transcript Parser-1.0.0-mac.zip` - ZIP archive

#### Linux

```bash
npm run electron:build:linux
```

Generates:

- `release/Transcript Parser-1.0.0.AppImage` - AppImage
- `release/Transcript Parser-1.0.0.deb` - Debian package
- `release/Transcript Parser-1.0.0.rpm` - RPM package

#### All Platforms

```bash
npm run electron:build
```

## Features

### Native Desktop Features

- ✅ Native file picker for video selection
- ✅ Drag and drop video files
- ✅ System tray integration
- ✅ Native menus (File, Edit, View, Help)
- ✅ Keyboard shortcuts (Ctrl+O for Open, etc.)
- ✅ Desktop notifications
- ✅ Works completely offline
- ✅ Auto-updates (when published to GitHub Releases)

### Keyboard Shortcuts

- `Ctrl/Cmd + O` - Open video file
- `Ctrl/Cmd + Q` - Quit application
- `Ctrl/Cmd + R` - Reload
- `Ctrl/Cmd + Shift + I` - Toggle DevTools
- `F11` - Toggle fullscreen

## Distribution

### GitHub Releases (Recommended)

1. Build all platforms: `npm run electron:build`
2. Create a new GitHub Release
3. Upload the executables from the `release/` folder
4. Users can download and install

### File Sizes

- Windows Installer: ~150MB
- macOS DMG: ~150MB
- Linux AppImage: ~150MB

## Security

- Context isolation enabled
- Node integration disabled in renderer process
- Secure IPC communication via preload script
- Sandboxed renderer processes

## Troubleshooting

### Windows

- If SmartScreen blocks the app, click "More info" → "Run anyway"
- For production, you should code-sign the executable

### macOS

- If "app is damaged" message appears, run: `xattr -cr "/Applications/Transcript Parser.app"`
- For production, you need an Apple Developer certificate

### Linux

- Make AppImage executable: `chmod +x Transcript-Parser-1.0.0.AppImage`
- Run: `./Transcript-Parser-1.0.0.AppImage`

## Architecture

```
electron/
├── main.js       # Main Electron process (Node.js)
├── preload.js    # Secure bridge between main and renderer
└── menu.js       # (Future) Native menu configuration

resources/
└── icon.png      # Application icon (used for all platforms)

dist/             # Vite build output (loaded by Electron)
```

## API for Web App

The Electron app exposes these APIs to the web app via `window.electronAPI`:

```javascript
// Check if running in Electron
if (window.electronAPI?.isElectron) {
  // Select video file
  const filePath = await window.electronAPI.selectVideoFile()

  // Save transcript to disk
  const result = await window.electronAPI.saveTranscript(transcriptData)

  // Get app version
  const version = await window.electronAPI.getAppVersion()
}
```

## Future Enhancements

- [ ] Auto-updates via electron-updater
- [ ] Multiple window support
- [ ] Global keyboard shortcuts
- [ ] Menu bar app mode (macOS)
- [ ] Windows/macOS code signing
- [ ] Mac App Store distribution
- [ ] Microsoft Store distribution
