const path = require('path');
const { app, BrowserWindow, ipcMain, Menu, Notification, Tray } = require('electron')

const isDevelopment = !app.isPackaged
let mainWindow;
let splashWindow;

// const dockIcon = path.join(__dirname, 'assets', 'images', 'logo.png')
// const trayIcon = path.join(__dirname, 'assets', 'images', 'skull.png')

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false, // prevent html to access the ipcRenderer, so that they can't missuse these function
            contextIsolation: true, // cant override preload file values via console of browser
            enableRemoteModule: true, // Allow renderer to access Electron Native API which only get access in main thread
            worldSafeExecuteJavaScript: true, // Sanitize JS code
        }
    })

    splashWindow.loadURL(`file://${__dirname}/splash.html`)
    splashWindow.on('closed', () => { splashWindow = null });
    return splashWindow;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false,
        backgroundColor: '#6e707e',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // prevent html to access the ipcRenderer, so that they can't missuse these function
            contextIsolation: true, // cant override preload file values via console of browser
            enableRemoteModule: true, // Allow renderer to access Electron Native API which only get access in main thread
            worldSafeExecuteJavaScript: true, // Sanitize JS code
        }
    })

    if (isDevelopment) mainWindow.webContents.openDevTools()
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    mainWindow.on('closed', () => { mainWindow = null });
    return mainWindow;
}

ipcMain.on('notify', (_, message) => {
    if (process.platform === 'win32') app.setAppUserModelId("My Application");
    const notification = new Notification({ title: 'Runner', body: message, icon: `${__dirname}/icons/logo.png` })
    notification.show()
})

ipcMain.on('app-quit', (e) => app.quit())

let tray = null;
app.whenReady().then(() => {
    const template = require('./utils/Menu').createTemplate(app);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)

    // tray = new Tray(trayIcon);
    // tray.setContextMenu(menu); // we can create new menu for this but we're just fine and can use an existing menu instance
    // tray.setToolTip('MyApplication');

    const mainApp = createWindow()
    const splash = createSplashWindow()

    mainApp.once('ready-to-show', () => {
        // splash.destroy()
        // mainApp.show()
        setTimeout(() => {
            splash.destroy()
            mainApp.show()
        }, 3000)
    })
})

if (process.platform === 'darwin') {
    // app.dock.setIcon(dockIcon);
}

app.on('ready', (e) => { })
app.on('window-all-closed', (e) => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
// only for mac os where application hangs in dock
app.on('activate', (e) => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})

if (isDevelopment) require('electron-reload')(__dirname)