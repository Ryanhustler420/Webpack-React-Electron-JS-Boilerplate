const path = require('path');
const _ = require('lodash');
const os = require('os');
const fs = require('fs');
const mkdir = require('mkdirp');
const FileIO = require('./FileIO');
const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, Tray, Menu, globalShortcut, dialog, crashReporter } = require('electron');

const isDevelopment = !app.isPackaged
let mainWindow;
let splashWindow;

require('dotenv').config();
require(path.join(__dirname, 'listeners'))(app);
// const dockIcon = path.join(__dirname, 'assets', 'images', 'logo-black.png')
// const trayIcon = path.join(__dirname, 'assets', 'images', 'logo-black.png')

function openDevToolsForMainWindow() { mainWindow?.webContents?.openDevTools(); }
function closeDevToolsForMainWindow() { mainWindow?.webContents?.closeDevTools(); }
function isDevToolsOpenForMainWindow() { return mainWindow?.webContents?.isDevToolsOpened(); }

function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 200,
        minWidth: 450,
        minHeight: 200,
        closable: false,
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false, // prevent html to access the ipcRenderer, so that they can't missuse these function
            contextIsolation: true, // cant override preload file values via console of browser
            enableRemoteModule: true, // Allow renderer to access Electron Native API which only get access in main thread
            backgroundThrottling: true,
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
        minWidth: 1200,
        minHeight: 800,
        show: false,
        autoHideMenuBar: true,
        backgroundColor: '#fff', // white
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false, // prevent html to access the ipcRenderer, so that they can't missuse these function
            contextIsolation: true, // cant override preload file values via console of browser
            enableRemoteModule: true, // Allow renderer to access Electron Native API which only get access in main thread
            backgroundThrottling: true,
            worldSafeExecuteJavaScript: true, // Sanitize JS code
        }
    })

    if (isDevelopment) openDevToolsForMainWindow();
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.on('closed', () => { mainWindow = null });
    return mainWindow;
}

let tray = null;
app.whenReady().then(() => {
    // const template = require('./utils/Menu').createTemplate(app);
    // const menu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(menu)

    const mainApp = createWindow()
    const splash = createSplashWindow()
    mainApp.setMenu(null);

    // tray = new Tray(trayIcon);
    // tray.setContextMenu(menu); // we can create new menu for this but we're just fine and can use an existing menu instance
    // tray.setToolTip('MyApplication');

    app.setAppUserModelId('AppName')
    mainApp.once('ready-to-show', () => {
        splash.destroy();
        mainApp.show();
    })
})

if (process.platform === 'darwin') {
    // app.dock.setIcon(dockIcon);
}

app.whenReady().then(async () => {
    const ENV = app.isPackaged ? 'production' : 'development';
    const FILE_DUMPS = path.join(os.homedir(), `RepositoryName-${ENV}`);
    const pathToBatch = path.join(FILE_DUMPS, 'batch')

    if (!fs.existsSync(FILE_DUMPS)) await mkdir(FILE_DUMPS);

    // registrating only accelerator
    FileIO.read(pathToBatch, 'settings.json', async (e, response) => {
        let final = (_.isUndefined(response) && _.isEmpty(response)) ? JSON.stringify({}) : JSON.parse(response);
        final = _.isEmpty(final) ? JSON.stringify({}) : final;

        app.on('browser-window-focus', (e) => {
            // console.log('application is in focuse');
            // if (final['refresh']) { globalShortcut.register('CmdOrCtrl+Shift+R', () => mainWindow.reload()); }
            if (final['dev-console'] || isDevelopment) globalShortcut.register('CmdOrCtrl+Shift+.', () => {
                if (isDevToolsOpenForMainWindow()) closeDevToolsForMainWindow(); else openDevToolsForMainWindow();
            });

            if (final['refresh'] || isDevelopment) globalShortcut.register('CmdOrCtrl+Shift+R', () => mainWindow.reload());
            globalShortcut.register('CmdOrCtrl+Shift+S', () => mainWindow.webContents.send('hotkey::success', { reduxStateKey: 'sideBarVisible', description: 'Sidebar Visibility Toggled' }));
            globalShortcut.register('CmdOrCtrl+Shift+H', () => mainWindow.webContents.send('hotkey::success', { reduxStateKey: 'headerVisible', description: 'Header Visibility Toggled' }));
            globalShortcut.register('CmdOrCtrl+Shift+F', () => mainWindow.webContents.send('hotkey::success', { reduxStateKey: 'footerVisible', description: 'Footer Visibility Toggled' }));
            // globalShortcut.register('CmdOrCtrl+Shift+A', () => mainWindow.webContents.send('pageRequest::success', { to: '/create_new_ad_poll' }));
            globalShortcut.register('CmdOrCtrl+Shift+C', () => mainWindow.webContents.send('pageRequest::success', { to: '/create_new' }));
            globalShortcut.register('CmdOrCtrl+Shift+Backspace', () => mainWindow.webContents.send('goBack::success'));
        });

        app.on('browser-window-blur', (e) => {
            // console.log('application hidden');
            globalShortcut.unregisterAll();
        });

    }).catch(err => console.log(err));
});

// https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6
app.whenReady().then(() => {
    autoUpdater.checkForUpdatesAndNotify();
}).catch(err => console.log(err));

autoUpdater.on('update-available', () => {
    dialog.showMessageBox(mainWindow, {
        message: 'A new update is available. Downloading now...',
        title: 'Update Aleart',
        buttons: ['Ok']
    }).then(({ checkboxChecked, response }) => { })
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox(mainWindow, {
        message: 'Update Downloaded. It will be installed on restart. Restart now?',
        buttons: ['Restart', 'Close'],
        title: 'Updating Finished',
    }).then(({ checkboxChecked, response }) => {
        if (response == 0) autoUpdater.quitAndInstall();
    })
});

if (isDevelopment) require('electron-reload')(__dirname)

const baseUrl = isDevelopment ? `http://localhost:3002` : `https://www.domain.com`;
crashReporter.start({
    productName: 'RepositoryAppName',
    companyName: 'Company Inc',
    submitURL: `${baseUrl}/sandbox/v1/api/common/user/crash-report?machine=windows`,
    autoSubmit: true,
})
// setTimeout(() => process.crash(), 5000);