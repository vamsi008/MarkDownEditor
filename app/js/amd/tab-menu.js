module.exports = function menu(mainWindow) {
	
  var otherMenu = [{
    label: 'close tab',
    accelerator: 'Control+W',
    click: function() {
		
      mainWindow.webContents.send('close-tab1');
	 
    }
  }, {label: 'close other tabs',
    
    click: function() {
		
      mainWindow.webContents.send('close-other-tabs');
	 
    }
  }
  
  ];


  return otherMenu;
}
