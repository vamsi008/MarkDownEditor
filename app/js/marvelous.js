remote = require('remote');
dialog = remote.require('dialog');
fs = remote.require('fs');
clipboard = remote.require('clipboard');
appWindow = remote.getCurrentWindow();

//dialog.showMessageBox({title: "Hello", message: "Greetings!", buttons: ["OK"]});
//console.log(window.remote, window.dialog);
$(document).ready(function () {
  $("#text-input").markdown({
    onChange: function(e){
      $("#preview").html(markdown.toHTML(e.getContent()));
    }
  })
});
