// Get contextBridge and ipcRenderer from Electron
const { contextBridge, ipcRenderer } = require('electron');

// Expose a secure API to the renderer (frontend) side
contextBridge.exposeInMainWorld('api', {
  
  // Let the user select a folder, returns a list of music files
  selectFolder: async () => await ipcRenderer.invoke('dialog:selectFolder'),

  // Music playback controls - send messages to the main process
  playPause: () => ipcRenderer.send('play-pause'),         // Play or pause the music
  nextTrack: () => ipcRenderer.send('next-track'),         // Play the next song
  previousTrack: () => ipcRenderer.send('previous-track'), // Play the previous song

  // Listen for events from the main process (like when buttons are clicked in the tray)
  onPlayPauseAction: (callback) => ipcRenderer.on('play-pause-action', callback),
  onNextTrackAction: (callback) => ipcRenderer.on('next-track-action', callback),
  onPreviousTrackAction: (callback) => ipcRenderer.on('previous-track-action', callback),

  // Toggle between dark and light mode
  toggleTheme: () => ipcRenderer.send('toggle-theme'),           // Ask to change theme
  onThemeChanged: (callback) => ipcRenderer.on('theme-changed', callback), // Listen for theme change

  // Optional: handle shuffle and loop buttons
  toggleShuffle: () => ipcRenderer.send('toggle-shuffle'), // Shuffle the playlist
  toggleLoop: () => ipcRenderer.send('toggle-loop'),       // Repeat the playlist or song
});
