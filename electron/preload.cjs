const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  selectVideoFile: () => ipcRenderer.invoke('select-video-file'),
  saveTranscript: (transcript) => ipcRenderer.invoke('save-transcript', transcript),

  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // File drop listener
  onFileSelected: (callback) => {
    ipcRenderer.on('file-selected', (event, filePath) => callback(filePath))
  },

  // Platform info
  platform: process.platform,
  isElectron: true,
})
