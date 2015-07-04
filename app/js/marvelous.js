remote = require('remote');
dialog = remote.require('dialog');
fs = remote.require('fs');
clipboard = remote.require('clipboard');
appWindow = remote.getCurrentWindow();
ipc = require('ipc');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});

MarvelousEditor = function(inputSelector, previewSelector) {

}

//dialog.showMessageBox({title: "Hello", message: "Greetings!", buttons: ["OK"]});
//console.log(window.remote, window.dialog);
$(document).ready(function () {
  var filePath = null;
  var markdownEditor = null;

  $window = $(window);
  markdownInput = $('#text-input');
  filetitleContainer = $('#file-title');
  filepathContainer = $('#file-path');

  markdownInput.markdown({
    hiddenButtons: ['cmdPreview'],
    onChange: function(e){
      markdownEditor = e;
      $("#preview").html(marked(e.getContent()));
      $("#preview").find('a').attr('target', '_blank');
    }
  })

  ipc.on('editor-new', function (obj) {
    filePath = undefined;
    filetitleContainer.html('Unnamed');
    filepathContainer.empty();
    markdownEditor ? markdownEditor.setContent("") : markdownInput.empty();
    markdownInput.trigger('change');
  });

  ipc.on('editor-text', function (obj) {
    if (markdownEditor) { markdownEditor.setContent(obj.contents) };
    $('#text-input').empty().html(obj.contents).trigger('change');

    var lastSlash = obj.filename.lastIndexOf('/'),
      filename = (lastSlash <= 0) ? obj.filename : obj.filename.slice(lastSlash+1);

    filePath = obj.filename;
    filepathContainer.html(obj.filename);
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
      swal({
        title: 'Success',
        text: 'File saved successfully.',
        type: 'success',
        timer: 2000
      });
  });

  $window.on('resize', function () {
    $('#text-input, #preview').height($window.height() - $('.header').height() - $('.module-header').height() - 100);
  }).trigger('resize');
});
