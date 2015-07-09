var app = require('app'),
  BrowserWindow = require('browser-window'),
  Tray = require('tray'),
  Menu = require('menu'),
  MenuItem = require('menu-item'),
  dialog = require('dialog'),
  fs = require('fs'),
  clipboard = require('clipboard'),
  ipc = require('ipc'),
  mainMenu=require('./app/js/amd/main-menu.js'),
  mkdirp = require('mkdirp');

var homePath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
  sessionsFolder = homePath + '/.marvelous/sessions';
  lastSessionFile = sessionsFolder + '/last-session.json';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

ipc.on('editor-save', function (event, args) {
  fs.writeFileSync(args.filename, args.content);
  event.sender.send('save-success');
});

ipc.on('editor-save-and-close', function (event, args) {
  mkdirp(sessionsFolder, function (err) {
    if (err) {
      console.log("Cant create session file");
    } else {
      fs.writeFileSync(lastSessionFile, JSON.stringify(args));
    }
    mainWindow.close();
  });
});

ipc.on('editor-save-as', function (event, args) {
  dialog.showSaveDialog({ title: "Save as" }, function (filename) {
    if (filename !== undefined) {
      filename = filename.toString();
      if (filename.slice(-3) !== '.md' && filename.slice(-9) !== '.markdown') {
        filename = filename + '.md';
      }
      fs.writeFileSync(filename, args.content);
      event.sender.send('save-success');

      fs.readFile(filename, function(err, data) {
        if (err) {
          return false;
        }
        mainWindow.webContents.send('editor-text',{ fileId: args.fileId, filename: filename.toString(), contents: data.toString() });
      });
    }
  });
});

ipc.on('get-last-session' , function(event, args) {
  fs.readFile(lastSessionFile, function(err, data) {
    if (err) {
      mainWindow.webContents.send('editor-new');
      return false;
    }

    mainWindow.webContents.send('load-session', JSON.parse(data));
  });
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: 'app/img/marvelous.png',
    title: 'Marvelous'
  });
  mainWindow.maximize(true);
   mainWindow.openDevTools();
 	mainWindow.setMenu(Menu.buildFromTemplate(mainMenu(mainWindow)));

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('close', function () {
    mainWindow.webContents.send('window-close');
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });


});
