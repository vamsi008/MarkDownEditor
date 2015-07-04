var app = require('app'),
  BrowserWindow = require('browser-window'),
  Tray = require('tray'),
  Menu = require('menu'),
  MenuItem = require('menu-item'),
  dialog = require('dialog'),
  fs = require('fs'),
  clipboard = require('clipboard'),
  ipc = require('ipc');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var menuTemplate = [{
  label: 'Marvelous',
  submenu: [{
    label: 'About Marvelous',
    accelerator: 'Control+`',
    click: function () {
      dialog.showMessageBox({
        title: 'About Marvelous',
        message: 'Marvelous was developed by \n\n Vamsi C,\n Srikanth P,\n Kiran D,\n Sudhir C \n\n as part of an Hackathon event in about 2 days. \n\nMarvelous is intended to be the reader for the next generation portable markdown files.',
        buttons: ['OK']
      });
    }
  }, {
    type: 'separator'
  }, {
    label: 'Help',
    accelerator: 'Control+H',
    selector: 'help:'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Control+Q',
    selector: 'terminate:'
  }, ]
}, {
  label: 'File',
  submenu: [{
    label: 'New',
    accelerator: 'Control+N',
    click: function () {
      mainWindow.webContents.send('editor-new');
    }
  }, {
    label: 'Open',
    accelerator: 'Control+O',
    click: function () {
      dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
          { name: 'All', extensions: ['md', 'markdown', 'MD', 'txt', 'TXT' ]},
          { name: 'Markdown', extensions: ['md', 'markdown', 'MD' ]},
          { name: 'Plain-text', extensions: ['txt', 'TXT' ]}
        ]
      }, function(filename) {
        if (filename) {
          fs.readFile(filename.toString(), function(err, data) {
            if (err) {
              return false;
            }
            mainWindow.webContents.send('editor-text',{ filename: filename.toString(), contents: data.toString() });
          });
        }
      });
    }
  }, {
    type: 'separator'
  }, {
    label: 'Save',
    accelerator: 'Control+S',
    click: function () {
      mainWindow.webContents.send('editor-save');
    }
  }, {
    label: 'Save as',
    accelerator: 'Control+Shift+S',
    click: function () {
      mainWindow.webContents.send('editor-save-as');
    }
  }]
}, {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'Control+Z',
    selector: 'undo:'
  }, {
    label: 'Redo',
    accelerator: 'Shift+Control+Z',
    selector: 'redo:'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'Control+X',
    selector: 'cut:'
  }, {
    label: 'Copy',
    accelerator: 'Control+C',
    selector: 'copy:'
  }, {
    label: 'Paste',
    accelerator: 'Control+V',
    selector: 'paste:'
  }, {
    label: 'Select All',
    accelerator: 'Control+A',
    selector: 'selectAll:'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'Control+R',
    click: function() {
      mainWindow.reload();
    }
  }, {
    label: 'Toggle DevTools',
    accelerator: 'Control+Shift+I',
    click: function() {
      mainWindow.toggleDevTools();
    }
  }]
}, {
  label: 'Window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'Control+M',
    click: function () {
      mainWindow.minimize();
    }
  }, {
    label: 'Close',
    accelerator: 'Control+W',
    click: function () {
      mainWindow.close();
    }
  }]
}];

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
        mainWindow.webContents.send('editor-text',{ filename: filename.toString(), contents: data.toString() });
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

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
