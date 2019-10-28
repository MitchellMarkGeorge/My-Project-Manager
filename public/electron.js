const { app, BrowserWindow } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680,
    minHeight: 680,
    minWidth: 900, // might rethink minheigt and minwidth 
    backgroundColor: '#ffffff',
    //titleBarStyle: 'hidden', // 'hidden-inset' - "removes" titlebar on MacOS 
    show: false, 
    webPreferences: {
        nodeIntegration: true
      }});
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
//   if (isDev) {
//     // Open the DevTools.
//     //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
//     mainWindow.webContents.openDevTools();
//   }
  mainWindow.on('closed', () => mainWindow = null);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
});
}



app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});