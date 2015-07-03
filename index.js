var app = require('app'),
  BrowserWindow = require('browser-window'),
  Tray = require('tray'),
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
    accelerator: 'Control+`',
    click: function () {
      dialog.showMessageBox({
        title: 'About Marvelous',
        message: 'Marvelous was developed by Vamsi Chava, Srikanth P, Kiran Danduprolu, Gaurav T as part of an Hackathon event in about 2 days. \n\nMarvelous is intended to be the reader for the next generation portable markdown files.',
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
    label: 'Open',
    accelerator: 'Control+O',
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
    accelerator: 'Control+S',
    selector: 'save:'
  }, {
    label: 'Save as',
    accelerator: 'Control+Shift+S',
    selector: 'save-as:'
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
    accelerator: 'Alt+Control+I',
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

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'app/img/marvelous.png',
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
