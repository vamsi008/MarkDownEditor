Marvel.MarvelousEditor = function() {
  this.textarea = $('#text-input');
  this.previewArea = $('#preview');
  this.filetitleContainer = $('#file-title');
  this.filepathContainer = $('#file-path');

  this.markdownEditor = undefined;
  this.openedFiles = [];
  this.openedFile = undefined;
  this.openedFileIndex = undefined;

  this.init();
};

Marvel.MarvelousEditor.prototype = {
  init: function () {
    var self = this;
    self.textarea.markdown({
      hiddenButtons: ['cmdPreview'],
      onChange: function (e) {
        self.markdownEditor = e;
        self.previewArea.html(marked(e.getContent()));
        self.previewArea.find('a').attr('target', '_blank');
      }
    }).trigger('change');

    self.bindEvents();
    self.bindIPCEvents();
  },

  bindEvents: function () {
    var self = this;
    self.bindWindowResizeHandler();
  },

  bindWindowResizeHandler: function () {
    var self = this,
      magicHeight = 100;

    $window.on('resize', function () {
      $('#text-input, #preview').height($window.height() - $('.header').height() - $('.module-header').height() - magicHeight);
    }).trigger('resize');
  },

  bindIPCEvents: function () {
    var self = this;
    self.bindNewFile();
    self.bindOpenFile();
    self.bindSaveFile();
    self.bindSaveFileAs();
    self.bindSaveSuccess();
  },

  bindNewFile: function () {
    var self = this;
    ipc.on('editor-new', function (obj) {
      var file = new Marvel.File();
      self.openFile(file);
    });
  },

  bindOpenFile: function () {
    var self = this;
    ipc.on('editor-text', function (obj) {
      var file = new Marvel.File(obj.filename, obj.contents);
      self.openFile(file);
    });
  },

  bindSaveFile: function () {
    var self = this;
    ipc.on('editor-save', function () {
      if (self.openedFile.filepath) {
        ipc.send('editor-save', {
          filename: self.openedFile.filepath,
          content: self.markdownEditor.getContent()
        });
      } else {
        var content = self.markdownEditor ? self.markdownEditor.getContent() : self.textarea.html();
        ipc.send('editor-save-as', {
          content: content
        });
      }
    });
  },

  bindSaveFileAs: function () {
    var self = this;
    ipc.on('editor-save-as', function () {
      ipc.send('editor-save-as', {
        content: self.markdownEditor.getContent()
      });
    });
  },

  bindSaveSuccess: function () {
    var self = this;
    ipc.on('save-success', function () {
        swal({
          title: 'Success',
          text: 'File saved successfully.',
          type: 'success',
          timer: 2000
        });
    });
  },

  openFile: function (file) {
    if (!file) { return; }
    var self = this;
    self.openedFile = file;
    self.openedFiles.push(file);
    self.filetitleContainer.html(file.title);
    self.filepathContainer.html(file.filepath);
    self.markdownEditor.setContent(file.content);
    self.textarea.trigger('change');
  },

  openFileAt: function (index) {
    var self = this;
    if (index < 0 || index >= this.openedFiles.length) return;
    self.openedFile = self.openedFiles[index];
    self.openedFileIndex = index;
  }
};
