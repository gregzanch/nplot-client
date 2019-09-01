const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const express = require('express');
const fs = require('fs');
const path = require('path');
const server = express();
const storage = require('electron-json-storage');

const logerror = err => {
  if (err) {
    console.log(err);
  }
}

const default_storage = {
  http: {
      port: 45921
    },
  window: {
      width: 800,
      height: 600,
      x: 100,
      y: 100
    }
  }
let appstore = default_storage;
const storage_path = storage.getDefaultDataPath();
let storage_dir_contents = fs.readdirSync(storage_path);
Object.keys(default_storage).forEach(x => {
  if (!storage_dir_contents.includes(`${x}.json`)) {
    storage.set(x, default_storage[x],logerror);
  }
});
if (storage_dir_contents.length > 0) {
  appstore = Object.assign(appstore, storage_dir_contents.reduce((a, b) => {
    if (path.extname(b) === ".json") {
      a[path.basename(b).slice(0, -5)] = JSON.parse(fs.readFileSync(path.join(storage_path, b), 'utf8'))
    }
    return a;
  }, {}));
}


let mainWindow
console.log(appstore)
function createWindow() {
  mainWindow = new BrowserWindow({
    width: appstore.window.width,
    height: appstore.window.height,
    x: appstore.window.x,
    y: appstore.window.y,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.addListener('resize', e => {
    appstore.window = Object.assign(appstore.window, mainWindow.getBounds());
  });
  mainWindow.addListener('moved', e => {
    appstore.window = Object.assign(appstore.window, mainWindow.getBounds());
  });
  mainWindow.on('blur', e => {
    appstore.window = Object.assign(appstore.window, mainWindow.getBounds());
      Object.keys(default_storage).forEach(x => {
        storage.set(x, default_storage[x], logerror);
      })
  })

  mainWindow.loadFile('index.html')
  mainWindow.on('closed', function () {
    Object.keys(default_storage).forEach(x => {
      storage.set(x, default_storage[x], logerror);
    })
    mainWindow = null
  });
  
  mainWindow.webContents.on('did-finish-load', e => {
    mainWindow.webContents.executeJavaScript(`document.getElementById('port-value').value=${appstore.http.port}`);
  })
  
}

app.on('ready', createWindow)
app.on('before-quit', e => {
  Object.keys(default_storage).forEach(x => {
    storage.set(x, default_storage[x], logerror);
  })
})
app.on('quit', e => {
  Object.keys(default_storage).forEach(x => {
    storage.set(x, default_storage[x], logerror);
  })
})
app.on('will-quit', e => {
  Object.keys(default_storage).forEach(x => {
    storage.set(x, default_storage[x], logerror);
  })
})
app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

function getWindow() {
  return mainWindow;
}

ipcMain.on('request-handled', (event, arg) => {
  console.log(arg);
})

ipcMain.on('port-change', (event, arg) => {
  console.log(`port set to ${arg}`);
  appstore.http.port = arg;
  
})

server.post('/nplot/', function (req, res) {
  let incomingdata = "";
  req.on('data', (chunk) => {
    incomingdata += chunk.toString();
  })
  req.on('end', e => {
    res.send("done");
    const json = JSON.parse(incomingdata);
    console.log(json);
    getWindow().webContents.send('request', json);
  })
})


server.get('/', function (req, res) {
  getWindow().webContents.send('request', req.params);
  res.send(JSON.stringify(req.params))
});

server.listen(appstore.http.port, () => console.log(`Listening on port ${appstore.http.port}`))
