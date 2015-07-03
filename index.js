var app = require('app'),
  BrowserWindow = require('browser-window'),
  Menu = require('menu'),
  MenuItem = require('menu-item'),
  dialog = require('dialog'),
  fs = require('fs'),
  clipboard = require('clipboard');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;
var menuTemplate = [{
  label: 'Marvelous',
  submenu: [{
    label: 'About Marvelous',
    selector: 'orderFrontStandardAboutPanel:'
  }, {
    type: 'separator'
  }, {
    label: 'Help',
    accelerator: 'Command+H',
    selector: 'help:'
  }, {
    type: 'separator'
  }, {
    label: 'Quit',
    accelerator: 'Command+Q',
    selector: 'terminate:'
  }, ]
}, {
  label: 'File',
  submenu: [{
    label: 'Open',
    accelerator: 'Command+O',
    selector: 'open:',
    click: function handleOpenButton() {
      dialog.showOpenDialog({ properties: ['openFile']}, function(filename) {
        if (filename) {
          fs.readFile(filename.toString(), function(err, data) {
            if (err) {
              console.log("Read failed: " + err);
              return false;
            }

            console.log(data);
          });
        }
      });
    }
  }, {
    type: 'separator'
  }, {
    label: 'Save',
    accelerator: 'Command+S',
    selector: 'save:'
  }, {
    label: 'Save as',
    accelerator: 'Command+Shift+S',
    selector: 'save-as:'
  }]
}, {
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'Command+Z',
    selector: 'undo:'
  }, {
    label: 'Redo',
    accelerator: 'Shift+Command+Z',
    selector: 'redo:'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'Command+X',
    selector: 'cut:'
  }, {
    label: 'Copy',
    accelerator: 'Command+C',
    selector: 'copy:'
  }, {
    label: 'Paste',
    accelerator: 'Command+V',
    selector: 'paste:'
  }, {
    label: 'Select All',
    accelerator: 'Command+A',
    selector: 'selectAll:'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'Command+R',
    click: function() {
      mainWindow.reload();
    }
  }, {
    label: 'Toggle DevTools',
    accelerator: 'Alt+Command+I',
    click: function() {
      mainWindow.toggleDevTools();
    }
  }]
}, {
  label: 'Window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'Command+M',
    selector: 'performMiniaturize:'
  }, {
    label: 'Close',
    accelerator: 'Command+W',
    selector: 'performClose:'
  }]
}];

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Marvelous'
  });

  var menu = new Menu();
  menu = Menu.buildFromTemplate(menuTemplate);
  mainWindow.setMenu(menu);

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
