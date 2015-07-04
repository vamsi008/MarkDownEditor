remote = require('remote');
dialog = remote.require('dialog');
fs = remote.require('fs');
clipboard = remote.require('clipboard');
appWindow = remote.getCurrentWindow();
ipc = require('ipc');

MarvelousEditor = function(inputSelector, previewSelector) {

}

//dialog.showMessageBox({title: "Hello", message: "Greetings!", buttons: ["OK"]});
//console.log(window.remote, window.dialog);
$(document).ready(function () {
  var filePath = null;
  var markdownEditor = null;

  markdownInput = $('#text-input');
  filetitleContainer = $('#file-title');
  filepathContainer = $('#file-path');

  markdownInput.markdown({
    hiddenButtons: ['cmdPreview'],
    onChange: function(e){
      markdownEditor = e;
      $("#preview").html(markdown.toHTML(e.getContent()));
    }
  })

  ipc.on('editor-text', function (obj) {
    if (markdownEditor) { markdownEditor.setContent(obj.contents) };
    $('#text-input').empty().html(obj.contents).trigger('change');

    var lastSlash = obj.filename.lastIndexOf('/'),
      filename = (lastSlash <= 0) ? obj.filename : obj.filename.slice(lastSlash+1);

    filePath = obj.filename;
    filepathContainer.html(obj.filename).show();
    filetitleContainer.html(filename);
  });

  ipc.on('editor-save', function () {
    if (filePath) {
      ipc.send('editor-save', { filename: filePath, content: markdownEditor.getContent() });
    } else {
      var content = markdownEditor ? markdownEditor.getContent() : markdownInput.html();
      ipc.send('editor-save-as', { content: content });
    }
  });

  ipc.on('editor-save-as', function () {
    ipc.send('editor-save-as', { content: markdownEditor.getContent() });
  });

  ipc.on('save-success', function () {
      dialog.showMessageBox({ title: "Success!", message: 'File Saved Successfully.', buttons: ['OK'] });
  })
});
