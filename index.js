var app = require('app'),
  BrowserWindow = require('browser-window'),
  Tray = require('tray'),
  Menu = require('menu'),
  MenuItem = require('menu-item'),
  dialog = require('dialog'),
  fs = require('fs'),
  clipboard = require('clipboard'),
  ipc = require('ipc'),
  mainMenu=require('./app/js/amd/main-menu.js');

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

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: 'app/img/marvelous.png',
    title: 'Marvelous'
  });
  mainWindow.maximize(true);
 	mainWindow.setMenu(Menu.buildFromTemplate(mainMenu(mainWindow)));

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
