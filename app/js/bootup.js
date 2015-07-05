$ = jQuery = require('./vendor/js/jquery-2.1.4.js');
ipc = require('ipc');
remote = require('remote');
Menu = remote.require('menu');
MenuItem = remote.require('menu-item');
otherMenu=require('./app/js/amd/pop-up-menu.js');

$window = $(window);

var menu = Menu.buildFromTemplate(otherMenu(remote.getCurrentWindow()));
window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  menu.popup(remote.getCurrentWindow());
}, false);
