module.exports = function menu(mainWindow) {
  var otherMenu = [{
    label: 'Undo',
    accelerator: 'Control+Z',
    click: function() {
      mainWindow.webContents.undo();
    }
  },
  {
    label: 'Copy',
    accelerator: 'Control+C',
    click: function() {
      mainWindow.webContents.copy();
    }

  },
  {
    label: 'Paste',
    accelerator: 'Control+V',
    click: function() {
      mainWindow.webContents.paste();
    }
  },
];
  return otherMenu;
}
