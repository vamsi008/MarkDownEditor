module.exports = function menu(mainWindow) {

  var otherMenu = [{
    label: 'close tab',
    click: function() {
      mainWindow.webContents.send('close-tab');
    }
  }, {
    label: 'close other tabs',
    click: function() {
      mainWindow.webContents.send('close-other-tabs');
    }
  }

  ];


  return otherMenu;
}
