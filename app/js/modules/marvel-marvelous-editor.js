Marvel.MarvelousEditor = function() {
  this.tabBar = $('#tab-bar');
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
    self.bindTabSelection();
  },

  bindWindowResizeHandler: function () {
    var self = this,
      magicHeight = 100;

    $window.on('resize', function () {
      $('#text-input, #preview').height($window.height() - $('#tab-bar').height() - $('.header').height() - $('.module-header').height() - magicHeight);
    }).trigger('resize');
  },

  bindTabSelection: function () {
    var self = this;
    self.tabBar.on('click', '.file-tab', function () {
      var clkd = $(this),
        fileId = clkd.attr('file-id');

      self.openFileWithId(fileId);
    })
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
      var file = undefined;
      if (obj.fileId) {
        var index = self.updateFileWithId(obj.fileId, obj.filename, obj.contents);
        self.openFileAt(index);
      } else {
        file = new Marvel.File(obj.filename, obj.contents);
        self.openFile(file);
      }
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
          fileId: self.openedFile.id,
          content: content
        });
      }
    });
  },

  bindSaveFileAs: function () {
    var self = this;
    ipc.on('editor-save-as', function () {
      ipc.send('editor-save-as', {
        fileId: self.openedFile.id,
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
          type: 'success'
        });
    });
  },

  openFile: function (file) {
    if (!file) { return; }
    var self = this;
    self.openedFile = file;
    self.openedFiles.push(file);
    self.addTab(file);

    self.filetitleContainer.html(file.title);
    self.filepathContainer.html(file.filepath);
    self.markdownEditor.setContent(file.content);
    self.textarea.trigger('change');
  },

  openFileAt: function (index) {
    var self = this;
    if (index < 0 || index >= self.openedFiles.length) return;
    var file = self.openedFile = self.openedFiles[index];
    self.openedFileIndex = index;

    self.filetitleContainer.html(file.title);
    self.filepathContainer.html(file.filepath);
    self.markdownEditor.setContent(file.content);
    self.textarea.trigger('change');

    var tab = self.tabBar.find('.file-tab[file-id="' + file.id + '"]').addClass('selected-tab').siblings().removeClass('selected-tab');
  },

  openFileWithId: function (id) {
    var self = this;
    if (!id) return;
    for (var i = 0, length = self.openedFiles.length; i < length; i++) {
      if (self.openedFiles[i].id == id) {
        self.openFileAt(i);
        return i;
      }
    }

    return -1;
  },

  updateFileWithId: function (id, filename, content) {
    var self = this;
    if (!id) return;
    for (var i = 0, length = self.openedFiles.length; i < length; i++) {
      if (self.openedFiles[i].id == id) {
        var file = self.openedFiles[i];
        file.update(filename, content);
        self.tabBar.find('.file-tab[file-id="' + file.id + '"]').html(file.title).attr('title', file.filepath)
        self.openFileAt(i);
        return i;
      }
    }

    return -1;
  },

  addTab: function (file) {
    var self = this;
    var tab = $('<div class="col-sm-2 col-md-1 col-lg-1 file-tab" />').attr('file-id', file.id).html(file.title).attr('title', file.filepath);

    self.tabBar.append(tab);
    tab.addClass('selected-tab').siblings().removeClass('selected-tab');
  }
};
