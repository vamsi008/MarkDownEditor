Marvel.MarvelousEditor = function() {
  this.tabBar = $('#tab-bar');
  this.textarea = $('#text-input');
  this.previewArea = $('#preview');
  this.markdownEditor = undefined;

  this.openedFiles = [];
  this.openedFile = undefined;
  this.openedFileIndex = undefined;

  this.contextMenuElmt = undefined;

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

        if (self.openedFile) {
          self.openedFile.updateContent(e.getContent());
          var fileId = self.openedFile.id;
          if (self.openedFile.saved) {
            self.tabBar.find('.file-tab[file-id="' + fileId + '"]').removeClass('unsaved');
          } else {
            self.tabBar.find('.file-tab[file-id="' + fileId + '"]').addClass('unsaved');
          }
        }
      }
    }).trigger('change');

    self.bindEvents();
    self.bindIPCEvents();
    self.loadLastSession();

  },

  bindEvents: function () {
    var self = this;
    self.bindWindowResizeHandler();
    self.bindTabSelection();
    self.bindTabSortableEvent();
    self.bindKeyboardShortcuts();
    self.bindNewFileTabBarEvent();
    self.bindContextMenuEvents();
  },

  bindTabSortableEvent: function () {
    var self = this,
      tabBar = document.getElementById("tab-bar");

    Sortable.create(tabBar, {
      animation: 100,
      draggable: '.file-tab',
      onUpdate: function (e) {
        var item = e.item,
          $item = $(item);

        self.moveFileToIndex($item.attr('file-id'), $item.index());
      }
    });
  },

  bindKeyboardShortcuts: function () {
    var self = this,
      container = $('#marvelous-container');

    container.on('keydown', null, 'alt+1', function () {
      self.openFileAt(0);
    });

    container.on('keydown', null, 'alt+2', function () {
      self.openFileAt(1);
    });

    container.on('keydown', null, 'alt+3', function () {
      self.openFileAt(2);
    });

    container.on('keydown', null, 'alt+4', function () {
      self.openFileAt(3);
    });

    container.on('keydown', null, 'alt+5', function () {
      self.openFileAt(4);
    });

    container.on('keydown', null, 'alt+6', function () {
      self.openFileAt(5);
    });

    container.on('keydown', null, 'alt+7', function () {
      self.openFileAt(6);
    });

    container.on('keydown', null, 'alt+8', function () {
      self.openFileAt(7);
    });

    container.on('keydown', null, 'alt+9', function () {
      self.openFileAt(8);
    });

    container.on('keydown', null, 'alt+0', function () {
      self.openFileAt(9);
    });

    container.on('keyup', null, 'ctrl+w', function () {
      self.removeFileAt(self.openedFileIndex);
    });
  },

  bindNewFileTabBarEvent: function () {
    var self = this;
    self.tabBar.on('dblclick', function () {
      var file = new Marvel.File();
      self.openFile(file);
    });

    self.tabBar.on('dblclick', '.file-tab', function (e) {
      e.stopPropagation();
    });

    self.tabBar.on('click', '.new-file', function (e) {
      self.openFile(new Marvel.File());
    });
  },

  bindWindowResizeHandler: function () {
    var self = this,
      magicHeight = 72;

    $(window).on('resize', function () {
      $('#text-input, #preview').height($window.height() - $('#tab-bar').height() - $('.header').height() - $('.module-header').height() - magicHeight);
    }).trigger('resize');
  },

  bindTabSelection: function () {
    var self = this;
    self.tabBar.on('click', '.file-tab', function () {
      var clkd = $(this),
        fileId = clkd.attr('file-id');

      self.openFileWithId(fileId);
    });

    self.tabBar.on('click', '.glyphicon-remove', function (e) {
      var clkd = $(this),
        tabContext = clkd.parent(),
        tabNumber = tabContext.index();

      self.removeFileAt(tabNumber);
      e.stopPropagation();
    });
  },

  bindContextMenuEvents: function () {
    var self = this;
    $window.on('contextmenu', function (e) {
      var clkd = $(e.target);
      self.contextMenuElmt = clkd;

      e.preventDefault();

      if (clkd.hasClass('file-tab')) {
        menu = Menu.buildFromTemplate(tabMenu(remote.getCurrentWindow()));
        $.each(menu.items, function (d, i) {
          d.tabFileId = clkd.attr('file-id');
        });
        menu.popup(remote.getCurrentWindow());
      } else if (clkd.hasClass('tabs')){
        e.preventDefault();
      } else {
        menu = Menu.buildFromTemplate(otherMenu(remote.getCurrentWindow()));
        menu.popup(remote.getCurrentWindow());
      }
    });
  },

  bindIPCEvents: function () {
    var self = this;
    self.bindNewFile();
    self.bindOpenFile();
    self.bindSaveFile();
    self.bindSaveFileAs();
    self.bindSaveSuccess();
    self.bindViewModeEvents();
    self.bindCloseWindow();
    self.bindLoadSession();
    self.bindCloseTab();
  },

  bindCloseWindow: function () {
  	var self = this;
 	  ipc.on('window-close', function (obj) {
      var fileCount = self.openedFiles.length,
        state = { files: self.openedFiles, openedFileIndex: self.openedFileIndex };

      ipc.send('editor-save-and-close', state);
    });
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
        self.openedFile.setSaved();
        self.tabBar.find('.selected-tab').removeClass('unsaved');
    });
  },

  bindLoadSession: function () {
    var self = this;
    ipc.on('load-session', function (session) {
      if (session.files && session.files.length) {
        for (var i = 0, length = session.files.length; i < length; i++) {
          var file = session.files[i];
          self.openFile(new Marvel.File(file.filepath, file.content, file.id, file.originalContent));
        }

        self.openFileAt(session.openedFileIndex);
      } else {
        self.openFile(new Marvel.File());
      }
    });
  },

  bindViewModeEvents: function () {
    var self = this;
    ipc.on('editor-mode', function () {
      $('.editor-mode').removeClass('col-sm-6').removeClass('col-md-6')
        .addClass('col-sm-12').addClass('col-md-12').show();
      $('.preview-mode').hide();
    });

    ipc.on('preview-mode', function () {
      $('.preview-mode').removeClass('col-sm-6').removeClass('col-md-6')
        .addClass('col-sm-12').addClass('col-md-12').show();
      $('.editor-mode').hide();
    });

    ipc.on('split-mode', function () {
      $('.module-header > div, .modules > div').removeClass('col-sm-12').removeClass('col-md-12')
        .addClass('col-sm-6').addClass('col-md-6')
        .show();
    });
  },

  openFile: function (file) {
    if (!file) { return; }
    var self = this;
    self.openedFile = file;
    self.openedFileIndex = self.openedFiles.length;
    self.openedFiles.push(file);
    self.addTab(file);

    self.markdownEditor.setContent(file.content);
    self.textarea.trigger('change');
  },

  openFileAt: function (index) {
    var self = this;
    if (index < 0 || index >= self.openedFiles.length) return;
    self.openedFile = self.openedFiles[index];
    self.openedFileIndex = index;
    var file = self.openedFile;

    self.markdownEditor.setContent(file.content);
    self.textarea.trigger('change');

    var tab = self.tabBar.find('.file-tab[file-id="' + file.id + '"]').addClass('selected-tab').siblings().removeClass('selected-tab');
  },

  removeFileAt: function (index) {
    var self = this;
    if (index < 0 || index >= self.openedFiles.length) return;
    //if (self.openedFiles.length === 1) return;

    if (self.openedFiles[index].saved === false) {
      swal({
        title: "Are you sure?",
        text: "You will lose unsaved changes!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes"
      }, function (confirm) {
        if (confirm) {
          self.deleteTabAt(index);
        }
      });
    } else {
      self.deleteTabAt(index);
    }
  },

  removeFileWithId: function (id) {
    var self = this;
    if (!id) return;
    for (var i = 0, length = self.openedFiles.length; i < length; i++) {
      if (self.openedFiles[i].id == id) {
        self.removeFileAt(i);
        return i;
      }
    }

    return -1;
  },

  deleteTabAt: function (index) {
    var self = this,
      fileIdToBeRemoved = self.openedFiles[index].id;

    if (index < 0 || index >= self.openedFiles.length) return;
    if (self.openedFiles.length === 1){
      return;
    }

    if (index === self.openedFileIndex) {
      self.openFileAt((index-1 >= 0) ? index-1:index+1);
    }

    self.openedFiles.splice(index, 1);
    self.tabBar.find('.file-tab[file-id="' + fileIdToBeRemoved + '"]').remove();
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
          .append($('<span class="glyphicon glyphicon-remove pull-right" />'));
        self.openFileAt(i);
        return i;
      }
    }

    return -1;
  },

  moveFileToIndex: function (id, index) {
    var self = this;
    if (!id) return;
    for (var i = 0, length = self.openedFiles.length; i < length; i++) {
      if (self.openedFiles[i].id == id) {
        var file = self.openedFiles[i];
        self.openedFiles.splice(i, 1);
        self.openedFiles.splice(index, 0, file);
        self.openFileAt(index);
        return true;
      }
    }

    return false;
  },

  addTab: function (file) {
    var self = this;
    var tab = $('<div class="col-sm-2 col-md-1 col-lg-1 file-tab" />').attr('file-id', file.id).html(file.title).attr('title', file.filepath);
    tab.append($('<span class="glyphicon glyphicon-remove pull-right" />'));

    self.tabBar.find('.new-file').before(tab);
    tab.addClass('selected-tab').siblings().removeClass('selected-tab');
    if (!file.saved) {
      tab.addClass('unsaved');
    }
  },

  loadLastSession: function () {
    ipc.send('get-last-session');
  },

  bindCloseTab: function () {
    var self = this;
    ipc.on('close-tab', function (e) {
      if (self.contextMenuElmt.hasClass('file-tab')) {
        self.removeFileWithId(self.contextMenuElmt.attr('file-id'));
      }
    });
  }
};
