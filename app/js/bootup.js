$ = jQuery = require('./vendor/js/jquery-2.1.4.js');
Sortable = require('./vendor/js/Sortable.min.js');
ipc = require('ipc');
remote = require('remote');
Menu = remote.require('menu');
MenuItem = remote.require('menu-item');
otherMenu=require('./app/js/amd/pop-up-menu.js');
tabMenu = require('./app/js/amd/tab-menu.js');

$window = $(window);

var menu = Menu.buildFromTemplate(otherMenu(remote.getCurrentWindow()));

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  var s=e.srcElement.attributes.getNamedItem('class');

  if(s!=undefined && s.textContent.indexOf('file-tab')>0){

	  menu = Menu.buildFromTemplate(tabMenu(remote.getCurrentWindow()));
	  menu.popup(remote.getCurrentWindow());
  }else if(s.textContent === "row tabs"){
	  e.preventDefault();
  }
  else{
	  menu = Menu.buildFromTemplate(otherMenu(remote.getCurrentWindow()));
	  menu.popup(remote.getCurrentWindow());
	  }

}, false);
