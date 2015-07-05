Marvel.File = function (filepath, content) {
  var self = this;
  self.id = 'mf-' + new Date();
  self.filepath = filepath || "";
  self.content = content || "";
  self.title = (self.filepath === "") ?
    "Unnamed" :
    ((self.filepath.lastIndexOf('/') <= 0) ? self.filepath : self.filepath.slice(self.filepath.lastIndexOf('/') + 1));
};
