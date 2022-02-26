// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { ipcRenderer, contextBridge, remote } = require('electron');
const listenersStore = {};

contextBridge.exposeInMainWorld('electron', {
  notificationApi: {
    sendNotification(message) {
      ipcRenderer.send('notify', message)
    },
    // Warning do not invoke this function at any cost,
    // Leaving the code here to refer later for some use case
    sendNotification(message, jsExpression) {
      eval(jsExpression)
      ipcRenderer.send('notify', message)
    },
  },
  appApi: {
    quitApp() {
      ipcRenderer.send('app-quit')
    },
    confirmBox: {
      send(title, message, buttons = ['Yes', 'No']) {
        ipcRenderer.send('confirmBox::request', title, message, buttons);
      },
      openL(cb) {
        const listener = (_, response) => cb(response);
        ipcRenderer.on('confirmBox::success', listenersStore['confirmBox::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('confirmBox::success', listenersStore['confirmBox::success']);
      }
    },
    getInstallationDirectory: {
      send() {
        ipcRenderer.send('getInstallationDirectory::request', '-');
      },
      openL(cb) {
        const listener = (_, o) => cb(o);
        ipcRenderer.on('getInstallationDirectory::success', listenersStore['getInstallationDirectory::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('getInstallationDirectory::success', listenersStore['getInstallationDirectory::success']);
      }
    },
    saveImageIDKLocation: {
      send(skd_details_info = {}) {
        ipcRenderer.send('saveImageIDKLocation::request', skd_details_info);
      },
      openL(cb) {
        const listener = (_, skd_details_info) => cb(skd_details_info);
        ipcRenderer.on('saveImageIDKLocation::success', listenersStore['saveImageIDKLocation::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('saveImageIDKLocation::success', listenersStore['saveImageIDKLocation::success']);
      }
    },
    getImageIDKLocation: {
      send() {
        ipcRenderer.send('getImageIDKLocation::request', '-');
      },
      openL(cb) {
        const listener = (_, skd_details_info) => cb(skd_details_info);
        ipcRenderer.on('getImageIDKLocation::success', listenersStore['getImageIDKLocation::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('getImageIDKLocation::success', listenersStore['getImageIDKLocation::success']);
      }
    },
    pageRequest: {
      send(path) {
        ipcRenderer.send('pageRequest::request', path);
      },
      openL(cb) {
        const listener = (_, path) => cb(path);
        ipcRenderer.on('pageRequest::success', listenersStore['pageRequest::success'] = listener)
      },
      closeL() {
        ipcRenderer.removeListener('pageRequest::success', listenersStore['pageRequest::success']);
      }
    },
    goBack: {
      send() {
        ipcRenderer.send('goBack::request', '-');
      },
      openL(cb) {
        const listener = (_, e) => cb();
        ipcRenderer.on('goBack::success', listenersStore['goBack::success'] = listener)
      },
      closeL() {
        ipcRenderer.removeListener('goBack::success', listenersStore['goBack::success']);
      }
    },
    hotkey: {
      send() {
        ipcRenderer.send('hotkey::request', '-');
      },
      openL(cb) {
        const listener = (_, info) => cb(info);
        ipcRenderer.on('hotkey::success', listenersStore['hotkey::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('hotkey::success', listenersStore['hotkey::success']);
      }
    },
    metaData: {
      send() {
        ipcRenderer.send('metaData::request', '-');
      },
      openL(cb) {
        const listener = (_, meta) => cb(meta);
        ipcRenderer.on('metaData::success', listenersStore['metaData::success'] = listener)
      },
      closeL() {
        ipcRenderer.removeListener('metaData::success', listenersStore['metaData::success']);
      }
    },
    env: {
      get() {
        return { isDevelopment: !remote.app.isPackaged }
      }
    },
    app_version: {
      get() {
        return remote.app.getVersion()
      }
    }
  },
  portal: {
    appname_values: {
      send(infos = {}) {
        ipcRenderer.send('appname_values::request', infos);
      },
      openL(cb) {
        const listener = (_, info) => cb(info);
        ipcRenderer.on('appname_values::success', listenersStore['appname_values::success'] = listener)
      },
      closeL() {
        ipcRenderer.removeListener('appname_values::success', listenersStore['appname_values::success']);
      }
    }
  },
  os: {
    systemDetails: {
      send() {
        ipcRenderer.send('systemDetails::request', 'something');
      },
      openL(cb) {
        const listener = (_, sys_info_object) => cb(sys_info_object);
        ipcRenderer.on('systemDetails::success', listenersStore['systemDetails::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('systemDetails::success', listenersStore['systemDetails::success']);
      }
    }
  },
  fileApi: {
    json: {
      read(filePath) {
        ipcRenderer.send('read-json', filePath)
      },
      catch(cb) {
        const listener = (_, fileData) => cb(fileData);
        ipcRenderer.on('response-read-json', listenersStore['response-read-json'] = listener);
      },
      stop() {
        ipcRenderer.removeListener('response-read-json', listenersStore['response-read-json']);
      }
    }
  },
  lwip: {
    // it will return the file path and details
    padSingleImage: {
      send(path, config = { padLeft: 150, padTop: 150, padRight: 150, padBottom: 150, bg: 'white' }, skd_details_info = {}) {
        ipcRenderer.send('padSingleImage::request', path, config, skd_details_info);
      },
      openL(cb) {
        const listener = (_, f_info) => cb(f_info);
        ipcRenderer.on('padSingleImage::success', listenersStore['padSingleImage::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('padSingleImage::success', listenersStore['padSingleImage::success']);
      }
    },
    padMultipleImage: {
      send(paths, config = { padLeft: 150, padTop: 150, padRight: 150, padBottom: 150, bg: 'white' }, skd_details_info = {}) {
        ipcRenderer.send('padMultipleImage::request', paths, config, skd_details_info);
      },
      openL(cb) {
        const listener = (_, fs_info) => cb(fs_info);
        ipcRenderer.on('padMultipleImage::success', listenersStore['padMultipleImage::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('padMultipleImage::success', listenersStore['padMultipleImage::success']);
      }
    }
  },
  utility: {
    newBsonObjectID: {
      send() {
        ipcRenderer.send('newBsonObjectID::request', 'something');
      },
      openL(cb) {
        const listener = (_, random_id) => cb(random_id);
        ipcRenderer.on('newBsonObjectID::success', listenersStore['newBsonObjectID::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('newBsonObjectID::success', listenersStore['newBsonObjectID::success']);
      }
    }
  },
  cookies: {
    persistCookie: {
      send(cookie) {
        ipcRenderer.send('persistCookie::request', cookie);
      },
      openL(cb) {
        const listener = (_, cookie) => cb(cookie);
        ipcRenderer.on('persistCookie::success', listenersStore['persistCookie::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('persistCookie::success', listenersStore['persistCookie::success']);
      }
    },
    retrieveCookie: {
      send() {
        ipcRenderer.send('retrieveCookie::request', '');
      },
      openL(cb) {
        const listener = (_, cookie) => cb(cookie);
        ipcRenderer.on('retrieveCookie::success', listenersStore['retrieveCookie::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('retrieveCookie::success', listenersStore['retrieveCookie::success']);
      }
    },
    getCookie: {
      send(cookie_name) {
        ipcRenderer.send('getCookie::request', cookie_name);
      },
      openL(cb) {
        const listener = (_, cookie) => cb(cookie);
        ipcRenderer.on('getCookie::success', listenersStore['getCookie::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('getCookie::success', listenersStore['getCookie::success']);
      }
    }
  },
  db: {
    clearAll: {
      send() {
        ipcRenderer.send('clearAll::request', 'ALL');
      },
      openL(cb) {
        const listener = (_, e) => cb();
        ipcRenderer.on('clearAll::success', listenersStore['clearAll::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('clearAll::success', listenersStore['clearAll::success']);
      }
    },
    getUserLikes: {
      send(key) {
        ipcRenderer.send('getUserLikes::request', key);
      },
      openL(cb) {
        const listener = (_, ids) => cb(ids);
        ipcRenderer.on('getUserLikes::success', listenersStore['getUserLikes::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('getUserLikes::success', listenersStore['getUserLikes::success']);
      }
    },
    saveUserLikes: {
      send(key, ids = []) {
        ipcRenderer.send('saveUserLikes::request', key, ids);
      },
      openL(cb) {
        const listener = (_, ids) => cb(ids);
        ipcRenderer.on('saveUserLikes::success', listenersStore['saveUserLikes::success'] = listener);
      },
      closeL() {
        ipcRenderer.removeListener('saveUserLikes::success', listenersStore['saveUserLikes::success']);
      }
    },
  },
  betteryApi: {

  }
})