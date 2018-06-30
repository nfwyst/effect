(function(w) {
  var Module = w.Module ? w.Module : {};
  Module.Dialog = function(selector) {
    var dialogContainer = document.getElementById(selector); 

    if(!dialogContainer) return;

    var cover = document.createElement('div');
    var template = '';
    cover.className = 'dialog-cover';
    cover.style.display = 'none';
    document.body.appendChild(cover);
    this.cover = cover;
    this.title = dialogContainer.getAttribute('title');
    this.el = dialogContainer;

    template += '<div class="dialog">';
    template +=   '<div class="dialog-h">'
    template +=     '<h3>' + this.title + '</h3>';
    template +=     '<i class="btn-close">X</i>';
    template +=   '</div>';
    template +=   '<div class="dialog-b">';
    template +=     dialogContainer.innerHTML;
    template +=   '</div>'
    template += '</div>'

    dialogContainer.innerHTML = template;
  };
  Module.Dialog.prototype.show = function() {
    var self = this;
    self.cover.style.display = 'block';
    self.el.style.display = 'block';
    self.el.getElementsByTagName('i').item(0).onclick = function() {
      self.close();
    }
  }
  Module.Dialog.prototype.close = function() {
    this.cover.style.display = 'none';
    this.el.style.display = 'none';
    this.el.getElementsByTagName('i').item(0).onclick = null;
  }
  w.Module = Module;
}(window || {}));
