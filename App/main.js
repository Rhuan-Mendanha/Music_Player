// Importing important parts from Electron and other modules
const { app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeTheme } = require('electron');
const path = require('path'); // Helps work with file and folder paths
const fs = require('fs'); // Lets us read files and folders
const mm = require('music-metadata'); // Helps read music info (like artist, title, etc.)

let mainWindow; // This will be our main app window
let tray = null; // This will be the little app icon in the corner of the screen
let store; // To save user settings like the last opened folder

// Setting up storage so we can remember things like the last folder user picked
async function setupStore() {
  const { default: ElectronStore } = await import('electron-store');
  store = new ElectronStore();
}

// This function creates our main app window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Connects with preload script for secure communication
      contextIsolation: true, // Keeps app safe by separating environments
      nodeIntegration: false, // Also for security: we don’t allow Node.js in frontend
    },
    icon: path.join(__dirname, 'assets', 'icons', 'tray_icon.jpg'), // Icon for the window
    title: "MyMusicApp", // Title shown on top of the window
  });

  // Load the HTML page we built
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Let the window be resized
  mainWindow.setResizable(true);

  // Check for tray icon image (used for small icon in the system tray)
  const iconExtensions = ['png', 'jpg'];
  let trayIconPath;
  for (const ext of iconExtensions) {
    const candidate = path.join(__dirname, 'assets', 'icons', `tray_icon.${ext}`);
    if (fs.existsSync(candidate)) {
      trayIconPath = candidate;
      break;
    }
  }

  // If we found a tray icon, create the tray with menu options
  if (trayIconPath) {
    try {
      tray = new Tray(trayIconPath); // Set the icon
      const trayMenu = Menu.buildFromTemplate([
        { label: 'Play/Pause', click: () => mainWindow.webContents.send('play-pause') },
        { label: 'Next Track', click: () => mainWindow.webContents.send('next-track') },
        { label: 'Previous Track', click: () => mainWindow.webContents.send('previous-track') },
        { label: 'Toggle Theme', click: () => toggleTheme() },
        { label: 'Quit', click: () => app.quit() }
      ]);
      tray.setToolTip("MyMusicApp"); // Text shown when you hover over the tray icon
      tray.setContextMenu(trayMenu); // The right-click menu
    } catch (err) {
      console.error("Failed to load tray icon:", err);
    }
  } else {
    console.warn("No tray icon found.");
  }
}

// When the user picks a folder, read music files and get their info (title, artist, etc.)
ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  if (result.canceled) return []; // If user cancelled, return an empty list

  const folderPath = result.filePaths[0]; // Get the path to the chosen folder
  if (store) store.set('lastFolder', folderPath); // Remember it

  // Find all music files (mp3, wav, ogg)
  const files = fs.readdirSync(folderPath).filter(file => /\.(mp3|wav|ogg)$/i.test(file));

  // Read the metadata (title, artist, etc.) for each music file
  const metadataList = await Promise.all(files.map(async (file) => {
    const filePath = path.join(folderPath, file);
    let metadata = {};
    try {
      const meta = await mm.parseFile(filePath); // Read metadata
      metadata = {
        title: meta.common.title || file,
        artist: meta.common.artist || 'Unknown Artist',
        album: meta.common.album || '',
        duration: meta.format.duration || 0
      };
    } catch (err) {
      // If there's an error reading metadata, just use basic info
      metadata = { title: file, artist: 'Unknown', album: '', duration: 0 };
    }
    return {
      ...metadata,
      path: filePath,
      name: file
    };
  }));

  return metadataList; // Send the list back to the frontend
});

// Handle play/pause, next, and previous track events from the app
ipcMain.on('play-pause', event => {
  event.reply('play-pause-action');
});
ipcMain.on('next-track', event => {
  event.reply('next-track-action');
});
ipcMain.on('previous-track', event => {
  event.reply('previous-track-action');
});

// Handle shuffle and loop toggle events
ipcMain.on('toggle-shuffle', () => {
  mainWindow.webContents.send('toggle-shuffle-action');
});
ipcMain.on('toggle-loop', () => {
  mainWindow.webContents.send('toggle-loop-action');
});

// Switch between dark and light mode
ipcMain.on('toggle-theme', () => {
  const newTheme = nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
  nativeTheme.themeSource = newTheme;
  mainWindow.webContents.send('theme-changed', newTheme); // Inform the app about theme change
});

// Catch any errors that happen without being handled
process.on('unhandledRejection', error => {
  console.error("Unhandled promise rejection:", error);
});

// When the app is ready, set up the store and show the window
app.whenReady().then(async () => {
  await setupStore();
  createWindow();

  // If the app is reopened and no windows are open, create one
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed (except on Mac)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
