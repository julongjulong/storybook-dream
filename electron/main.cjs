// Windows app shell: one window that plays the built game from dist/.
// Progress lives in Chromium localStorage under %APPDATA%\storybook-dream.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('node:path');

app.setName('storybook-dream');

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#fcf5e9',
    title: '토끼 탐정과 열두 동화 사건',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  Menu.setApplicationMenu(null);
  // Links never open inside the game window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) void shell.openExternal(url);
    return { action: 'deny' };
  });
  const devUrl = process.env.STORYBOOK_DEV_URL;
  if (devUrl) void win.loadURL(devUrl);
  else void win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  if (process.argv.includes('--fullscreen')) win.setFullScreen(true);
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
