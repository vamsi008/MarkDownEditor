Marvel.File = function (filepath, content, timestamp, id, originalContent) {
  var self = this;
  self.init();
  self.update(filepath, content, timestamp);

  if (id !== undefined) {
    this.id = id;
    this.originalContent = originalContent;
    this.saved = (this.content === this.originalContent);
  }
};

Marvel.File.prototype = {
  init: function () {
    var self = this;
    self.id = 'mf-' + (+new Date());
    self.filepath = "";
    self.originalContent = "";
    self.content = "";
    self.title = "Unnamed";
    self.saved = true;
    self.modifiedTimestamp = (new Date()).toString();
  },

  update: function (filepath, content, timestamp) {
    var self = this;
    self.filepath = filepath || "";
    self.originalContent = content || "";
    self.content = content || "";
    self.title = (self.filepath === "") ?
      "Unnamed" :
      ((self.filepath.lastIndexOf('/') <= 0) ? self.filepath : self.filepath.slice(self.filepath.lastIndexOf('/') + 1));
    self.saved = true;
    self.modifiedTimestamp = timestamp || (new Date()).toString();
  },

  updateContent: function (content) {
    var self = this;
    self.content = content;
    self.saved = (self.originalContent === self.content);
  },

  setSaved: function () {
    var self = this;
    self.saved = true;
    self.originalContent = self.content;
    self.modifiedTimestamp = new Date();
  }
}
