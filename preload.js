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

const { ipcRenderer, contextBridge } = require('electron');

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
    }
  },
  betteryApi: {

  },
  fileApi: {

  }
})