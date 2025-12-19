const path = require('path')
const fs = require('fs')

// Get Electron modules - only available when running inside Electron
const electron = require('electron')

// Validate that we're running in Electron, not just loading the path
if (typeof electron === 'string' || !electron.app) {
  console.error('This file must be run within Electron, not Node.js directly')
  console.error('Use: npx electron . or npm run electron:dev')
  process.exit(1)
}

const { app, BrowserWindow, dialog, Menu, Tray, nativeImage } = electron

let mainWindow = null
let tray = null

// Enable live reload for development
// Check if running in development mode - use environment variable or check for dist folder
const isDev = process.env.NODE_ENV === 'development' || !require('fs').existsSync(path.join(__dirname, '../dist/index.html'))

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    icon: path.join(__dirname, '../resources/icon.png'),
    backgroundColor: '#ffffff',
    show: false, // Don't show until ready
  })

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Create application menu
  const menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function getMenuTemplate() {
  return [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Video',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            openVideoFile()
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Transcript Parser',
              message: 'Transcript Parser',
              detail: 'AI-powered video transcription with speaker diarization\n\nVersion: ' + app.getVersion(),
              buttons: ['OK'],
            })
          },
        },
      ],
    },
  ]
}

function createTray() {
  const iconPath = path.join(__dirname, '../resources/icon.png')
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })

  tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        if (mainWindow) {
          mainWindow.show()
        } else {
          createWindow()
        }
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      },
    },
  ])

  tray.setToolTip('Transcript Parser')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    } else {
      createWindow()
    }
  })
}

async function openVideoFile() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0]
    mainWindow.webContents.send('file-selected', filePath)
  }
}

// Setup IPC Handlers
function setupIPCHandlers() {
  const { ipcMain: ipc } = require('electron')

  ipc.handle('select-video-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Videos', extensions: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  })

  ipc.handle('save-transcript', async (event, transcript) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `transcript-${Date.now()}.json`,
      filters: [
        { name: 'JSON', extensions: ['json'] },
        { name: 'Text', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] },
      ],
    })

    if (!result.canceled && result.filePath) {
      try {
        fs.writeFileSync(result.filePath, JSON.stringify(transcript, null, 2))
        return { success: true, path: result.filePath }
      } catch (error) {
        return { success: false, error: error.message }
      }
    }
    return { success: false, error: 'Cancelled' }
  })

  ipc.handle('get-app-version', () => {
    return app.getVersion()
  })
}

// App lifecycle
app.whenReady().then(() => {
  setupIPCHandlers()
  createWindow()
  createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Handle file drops
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
  })
})
