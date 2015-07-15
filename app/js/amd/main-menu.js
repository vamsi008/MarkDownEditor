module.exports = function menu(mainWindow) {
  var dialog = require('dialog'),
    fs = require('fs'),
    process = require('process');

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
        title: 'Open File or Files',
        defaultPath: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'],
        properties: ['openFile', 'multiSelections', 'createDirectory'],
        filters: [
          { name: 'All', extensions: ['md', 'markdown', 'MD', 'txt', 'TXT' ]},
          { name: 'Markdown', extensions: ['md', 'markdown', 'MD' ]},
          { name: 'Plaintext', extensions: ['txt', 'TXT' ]}
        ]
      }, function(filenames) {
        if (filenames) {
          for (var i = 0, length = filenames.length; i < length; i++) {
            var filename = filenames[i];
            var data = fs.readFileSync(filename);
            var stats = fs.statSync(filename);
            mainWindow.webContents.send('editor-text',{ filename: filename, contents: data.toString(), timestamp: stats.mtime });
          }
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
    checked:false,
    type:'radio',
    click: function() {
      mainWindow.webContents.send('editor-mode');
    }
  }, {
    label: 'Preview Mode',
    accelerator: 'Control+Alt+P',
    checked:false,
    type:'radio',
    click: function() {
      mainWindow.webContents.send('preview-mode');
    }
  }, {
    label: 'Split Mode',
    accelerator: 'Control+Alt+S',
    checked:true,
    type:'radio',
    click: function() {
      mainWindow.webContents.send('split-mode');
    }
  },{
    type: 'separator'
  },{
    label: 'Show/Hide Tabs',
    accelerator: 'Control+Alt+H',
    checked: false,
    type: 'radio',
    click: function() {
      mainWindow.webContents.send('toggle-tabs');
    }
  },{
    label: 'Show/Hide Toolbar',
    accelerator: 'Control+Alt+T',
    checked: false,
    type: 'radio',
    click: function() {
      mainWindow.webContents.send('toggle-toolbar');
    }
  },{
    label: 'Show/Hide Statusbar',
    accelerator: 'Control+Alt+K',
    checked: false,
    type: 'radio',
    click: function() {
      mainWindow.webContents.send('toggle-statusbar');
    }
  },{
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
    accelerator: 'Control+Q',
    click: function () {
      mainWindow.webContents.send('window-close');
    }
  }]
}];


return menuTemplate;
}
