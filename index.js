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
    click: function () { require('shell').openExternal('http://github.com/vamsi008/MarkDownEditor') }
  } ]
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
    click: function() {
      mainWindow.webContents.undo();
    }
  }, {
    label: 'Redo',
    accelerator: 'Shift+Control+Z',
      click: function() {
      mainWindow.webContents.redo();
    }
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'Control+X',
    click: function() {
      mainWindow.webContents.cut();
    }
  }, {
    label: 'Copy',
    accelerator: 'Control+C',
    click: function() {
      mainWindow.webContents.copy();
    }

  }, {
    label: 'Paste',
    accelerator: 'Control+V',
    click: function() {
      mainWindow.webContents.paste();
    }
  }, {
    label: 'Select All',
    accelerator: 'Control+A',
       click: function() {
      mainWindow.webContents.selectAll();
    }
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Editor Mode',
    accelerator: 'Control+Alt+E',
    click: function() {
      mainWindow.webContents.send('editor-mode');
    }
  }, {
    label: 'Preview Mode',
    accelerator: 'Control+Alt+P',
    click: function() {
      mainWindow.webContents.send('preview-mode');
    }
  }, {
    label: 'Split Mode',
    accelerator: 'Control+Alt+S',
    click: function() {
      mainWindow.webContents.send('split-mode');
    }
  }, {
    type: 'separator'
  }, {
    label: 'Reset Marvelous',
    accelerator: 'Control+R',
    click: function() {
      mainWindow.reload();
    }
  }, {
    label: 'Toggle DevTools',
    accelerator: 'Control+Shift+I',
    visible: false,
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
 	mainWindow.setMenu(Menu.buildFromTemplate(menuTemplate));
  mainWindow.webContents.send('editor-new');

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
