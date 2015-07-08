module.exports = function menu(mainWindow) {
  var otherMenu = [{
    label: 'Undo',
    accelerator: 'Control+Z',
    click: function() {
      mainWindow.webContents.undo();
    }
  }

  ];

  return otherMenu;
}
