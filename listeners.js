const { ipcMain, Notification, session, dialog } = require('electron');
const path = require('path');
const execSync = require('child_process').execSync;
const FileIO = require(path.join(__dirname, 'FileIO'));
const DATA_STAGE = require('./utils/DataStage');
const DataEncryption = require('./utils/DataEncryption');
const bson = require('bson');
const _ = require('lodash');
const fs = require('fs');
const os = require('os');

function refine(final) {
    try { final = JSON.parse(final) } catch (e) { }
    return final;
}

module.exports = function (app) {

    const ENV = app.isPackaged ? 'production' : 'development';
    const FILE_DUMPS = path.join(os.homedir(), `RepositoryName-${ENV}`);

    // only for mac os where application hangs in dock
    app.on('activate', (e) => {
        if (BrowserWindow.getAllWindows()?.length === 0) {
            createWindow();
        }
    });
    app.on('ready', (e) => {

    });
    app.on('window-all-closed', (e) => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    // Standalone Listener
    ipcMain.on('app-quit', (e) => {
        dialog.showMessageBox(undefined, {
            message: 'Do you really want to quit the application ?',
            title: 'Exit',
            buttons: ['Yes', 'No']
        }).then(({ checkboxChecked, response }) => {
            if (response == 0) {
                app.quit();
            }
        })
    });
    ipcMain.on('read-json', (re, filePath) => {
        fs.readFile(filePath, function (error, content) {
            var stream = JSON.parse(content);
            re.sender.send('response-read-json', stream);
        });
    });
    ipcMain.on('notify', (_, message) => {
        if (process.platform === 'win32') app.setAppUserModelId("My Application");
        const notification = new Notification({ title: 'Runner', body: message, icon: `${__dirname}/build/js/images/trash.png` })
        notification.show()
    });
    ipcMain.on('confirmBox::request', async (re, title, message, buttons = ['Yes', 'No']) => {
        dialog.showMessageBox(undefined, {
            message: message,
            title: title,
            buttons: buttons,
        }).then(({ checkboxChecked, response }) => {
            re.sender.send("confirmBox::success", response);
        })
    });
    ipcMain.on('getInstallationDirectory::request', async (re, __) => {
        const o = {
            rootPath: __dirname,
            files: fs.readdirSync(__dirname)
        }
        re.sender.send("getInstallationDirectory::success", o);
    });

    const pathToIdk = path.join(FILE_DUMPS, 'idk');
    ipcMain.on('saveImageIDKLocation::request', async (re, skd_details_info) => {
        if (_.isUndefined(skd_details_info)) return;
        const token = await new DataEncryption().encode(skd_details_info, 'saveImageIDKLocation');
        await FileIO.writeJSON(pathToIdk, 'image_function.json', token);
        re.sender.send('saveImageIDKLocation::success', skd_details_info);
    });
    ipcMain.on('getImageIDKLocation::request', async (re, _) => {
        FileIO.read(pathToIdk, 'image_function.json', async (e, response) => {
            let final = (_.isUndefined(response) && _.isEmpty(response)) ? JSON.stringify({}) : JSON.stringify(await new DataEncryption().decode(response));
            final = _.isEmpty(JSON.parse(final)) ? JSON.stringify({}) : final;
            re.sender.send('getImageIDKLocation::success', refine(final));
        });
    });

    ipcMain.on('appname_values::request', (_, envs) => {
        DATA_STAGE.setEnvs(envs)
    });

    // Utility
    ipcMain.on('newBsonObjectID::request', async (re, _) => {
        const _id = new bson.ObjectID().toHexString();
        re.sender.send('newBsonObjectID::success', _id);
    });

    // Operating System
    ipcMain.on('systemDetails::request', async (re, _) => {
        const details = {
            arch: os.arch(),
            platform: os.platform(),
            hostname: os.hostname(),
            userInfo: os.userInfo(),
            freemem: os.freemem(),
            version: os.version().replaceAll(' ', '-'),
            combine: (`${os.version().replaceAll(' ', '-')}-${os.platform()}-${os.arch()}-${os.hostname()}-${os.userInfo().username}`)
        }
        re.sender.send('systemDetails::success', details);
    });

    function showIdkNotFoundMessageBox() {
        dialog.showMessageBox(undefined, {
            message: 'IDK not found! Please make sure you set the idk path in the setting',
            title: 'IDK Missing',
            buttons: ['Ok'],
        }).then(({ checkboxChecked, response }) => { });
    }

    function showSpoofingMessageBox() {
        dialog.showMessageBox(undefined, {
            message: 'Something is not right with IDK, Please try to refresh the application.',
            title: 'IDK Error',
            buttons: ['Ok'],
        }).then(({ checkboxChecked, response }) => { });
    }

    // LWIP feature
    ipcMain.on('padSingleImage::request', async (re, imgPath, config, skd_details_info) => {
        const idk_o = JSON.parse(skd_details_info);
        if (_.keys(idk_o)?.length == 0) {
            showIdkNotFoundMessageBox();
            return;
        }

        const quality = 30; // dont change this
        const exe = idk_o.name;
        const idk_path = idk_o.path.replace(exe, '');

        try {
            const dir = 'output';
            const dump = idk_path + dir;
            const resultFile = `${ENV}-operation.json`
            await FileIO.writeJSON(`${dump}`, `${resultFile}`, {});
            const bufferLog = execSync(`${exe} please run pad --url "${imgPath}" --args ${config.padLeft} ${config.padTop} ${config.padRight} ${config.padBottom} "${config.bg}" --dump ${dir} --resultFile ${resultFile} --quality ${quality}`, { cwd: idk_path, encoding: 'utf-8' });
            // console.log(bufferLog);
            FileIO.read(`${dump}`, `${resultFile}`, (e, response) => {
                const res = JSON.parse(response);
                if (_.keys(res)?.length == 0) showSpoofingMessageBox();
                else if (FileIO.isFileExits(res.urlResult?.imageDump)) {
                    res.urlResult['imageDump'] = idk_path + res.urlResult?.imageDump;
                    let final = (_.isUndefined(res.urlResult.fname_we) || _.isEmpty(res.urlResult.fname_we)) ? JSON.stringify({}) : res;
                    return re.sender.send('padSingleImage::success', refine(JSON.stringify(final)));
                }
                re.sender.send('padSingleImage::success', refine(JSON.stringify({})));
            })
        } catch (e) {
            console.log(e);
            re.sender.send('padSingleImage::success', refine(JSON.stringify({})));
        }
    });
    ipcMain.on('padMultipleImage::request', async (re, imagePaths = [], config, skd_details_info) => {
        const idk_o = JSON.parse(skd_details_info);
        if (_.keys(idk_o)?.length == 0) {
            showIdkNotFoundMessageBox();
            return;
        }

        const quality = 30; // dont change this
        const exe = idk_o.name;
        const idk_path = idk_o.path.replace(exe, '');

        try {
            const dir = 'output';
            const dump = idk_path + dir;
            const resultFile = `${ENV}-operation.json`
            await FileIO.writeJSON(`${dump}`, `${resultFile}`, {});
            const images = imagePaths.map(i => `"${i}"`).join(' ');
            const bufferLog = execSync(`${exe} please run pad --urls ${images} --args ${config.padLeft} ${config.padTop} ${config.padRight} ${config.padBottom} "${config.bg}" --dump ${dir} --resultFile ${resultFile} --quality ${quality}`, { cwd: idk_path, encoding: 'utf-8' });
            // console.log(bufferLog);
            FileIO.read(`${dump}`, `${resultFile}`, (e, response) => {
                const res = JSON.parse(response);
                if (_.keys(res)?.length == 0) showSpoofingMessageBox();
                else if (FileIO.isFileExits(res.urlsResult?.imageDumps)) {
                    res.urlsResult['imageDumps'] = _.map(res.urlsResult?.imageDumps, slug => `${idk_path}${slug}`);
                    let final = (_.isUndefined(res.urlsResult.names) && _.isEmpty(res.urlsResult.names)) ? JSON.stringify({}) : res;
                    return re.sender.send('padMultipleImage::success', refine(JSON.stringify(final)));
                }
                re.sender.send('padMultipleImage::success', refine(JSON.stringify({})));
            })
        } catch (e) {
            console.log(e);
            re.sender.send('padMultipleImage::success', refine(JSON.stringify({})));
        }
    });

    // Cookies [Using this for capturing the cookies for http request, axios dont support set-cookies so that's why, little bit of hack]
    const pathToBin = path.join(FILE_DUMPS, 'bin');
    ipcMain.on('persistCookie::request', async (re, cookie) => {
        if (_.isUndefined(cookie)) return;
        const token = await new DataEncryption().encode(cookie, 'persistCookie');
        await FileIO.writeJSON(pathToBin, 'session.json', token);
        re.sender.send('persistCookie::success', cookie);
    });
    ipcMain.on('retrieveCookie::request', async (re, __) => {
        FileIO.read(pathToBin, 'session.json', async (e, response) => {
            let final = (_.isUndefined(response) && _.isEmpty(response)) ? JSON.stringify({}) : JSON.stringify(await new DataEncryption().decode(response));
            final = _.isEmpty(JSON.parse(final)) ? JSON.stringify({}) : final;
            re.sender.send('retrieveCookie::success', refine(final));
        });
    })
    ipcMain.on('getCookie::request', async (re, cookie_name) => {
        if (_.isUndefined(cookie_name)) return;
        session.defaultSession.cookies.get({ name: cookie_name }).then(cookie => {
            re.sender.send('getCookie::success', cookie);
        });
    });

    // DB Listeners
    const pathToDump = path.join(FILE_DUMPS, 'cache');
    ipcMain.on('clearAll::request', async (re, key) => {
        if (!fs.existsSync(pathToDump)) await mkdirp(pathToDump);
        for (const file of fs.readdirSync(pathToDump)) fs.unlink(`${pathToDump}/${file}`, () => { });
    });
    ipcMain.on('getUserLikes::request', async (re, key) => {
        if (_.isUndefined(key)) return;
        FileIO.read(pathToDump, key + '.json', async (e, response) => {
            let final = (_.isUndefined(response) && _.isEmpty(response)) ? JSON.stringify([]) : JSON.stringify(await new DataEncryption().decode(response));
            final = _.isEmpty(JSON.parse(final)) ? JSON.stringify([]) : final;
            re.sender.send('getUserLikes::success', refine(final));
        });
    });
    ipcMain.on('saveUserLikes::request', async (re, key, ids = []) => {
        if (_.isUndefined(ids)) return;
        const token = await new DataEncryption().encode(ids, 'saveUserLikes');
        await FileIO.writeJSON(pathToDump, key + '.json', token);
        re.sender.send('saveUserLikes::success', ids);
    });

}