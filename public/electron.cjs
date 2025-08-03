const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV;

function createMainWindow(){
    // Since electron.cjs is in public folder, paths are different
    let iconPath;
    
    if (isDev) {
        // In development: public/electron.cjs -> public/app-icon.ico
        iconPath = path.join(__dirname, 'app-icon.ico');
    } else {
        // In production, files might be restructured
        iconPath = path.join(__dirname, 'app-icon.ico');
    }
    
    console.log('Current directory (__dirname):', __dirname);
    console.log('Icon path:', iconPath);
    console.log('Icon exists:', require('fs').existsSync(iconPath));
    
    // List files in current directory for debugging
    try {
        console.log('Files in current directory:', require('fs').readdirSync(__dirname));
    } catch (error) {
        console.error('Error reading directory:', error);
    }
    
    const mainWindow = new BrowserWindow({
        icon: require('fs').existsSync(iconPath) ? iconPath : undefined,
        title: 'Work Timer',
        width: 400,
        height: 400,
        resizable: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // preload.js is also in public folder
            contextIsolation: true,
            nodeIntegration: false,
        }
    });
    
    mainWindow.setMenuBarVisibility(false);
    
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Load from dist folder which is at ../dist relative to public
        mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }

    ipcMain.removeAllListeners('close-app');
    ipcMain.removeAllListeners('minimize-app');
    
    ipcMain.on('close-app', ()=>{
        app.quit();
    });

    ipcMain.on('minimize-app', ()=>{
        mainWindow.minimize();
    });
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});