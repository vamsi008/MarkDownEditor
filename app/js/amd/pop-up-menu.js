module.exports = function menu(mainWindow) {
  var otherMenu = [{
    label: 'Undo',
    accelerator: 'Control+Z',
    click: function() {
      mainWindow.webContents.undo();
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
  },
  {
    type: 'separator'
  },
  {
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
    accelerator: 'Control+Q',
    click: function () {
      mainWindow.close();
    }
  }]
}

  ];

  return otherMenu;
}
