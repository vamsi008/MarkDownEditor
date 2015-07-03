remote = require('remote');
dialog = remote.require('dialog');
fs = remote.require('fs');
clipboard = remote.require('clipboard');
appWindow = remote.getCurrentWindow();

console.log(appWindow);
//dialog.showMessageBox({title: "Hello", message: "Greetings!", buttons: ["OK"]});
//console.log(window.remote, window.dialog);

$("#text-input").markdown({
  onChange: function(e){
    $("#preview").html(markdown.toHTML(e.getContent()));
  }
})
