module.exports = function menu(mainWindow) {
  var otherMenu = [{
    label: 'Close Tab',
    click: function(e) {
      mainWindow.webContents.send('close-tab', e);
    }
  }, {
    label: 'Close Other Tabs',
    click: function(e) {
      mainWindow.webContents.send('close-other-tabs', e);
    }
  }];

  return otherMenu;
}
