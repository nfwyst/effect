'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Select = function () {
  function Select() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$id = _ref.id,
      id = _ref$id === undefined ? 'container' : _ref$id,
      _ref$data = _ref.data,
      data = _ref$data === undefined ? [] : _ref$data,
      _ref$searchable = _ref.searchable,
      searchable = _ref$searchable === undefined ? true : _ref$searchable;

    _classCallCheck(this, Select);

    this.value = null;
    this.lastIndex = null;
    this.browser = true;
    try {
      this.$mount = document.querySelector('#' + id);
    } catch (e) {
      this.browser = false;
    }
    this.data = this.transData(data);
    this.searchable = searchable;
    this.init();
  }

  _createClass(Select, [{
    key: 'transData',
    value: function transData(data) {
      if (!data.map) return [];
      return data.map(function (item, index) {
        return {
          curValue: '',
          nextValue: item,
          datas: item
        };
      });
    }
  }, {
    key: 'init',
    value: function init() {
      if (this.browser) {
        this.verify();
        this.bindMount();
        this.render();
      }
    }
  }, {
    key: 'load',
    value: function load(vals) {
      this.data = this.transData(vals);
      this.render();
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.data.length === 0) return false;
      this.$mount.innerHTML = '';
      var template = '\n    <div class="box">\n      <div class="selector" contenteditable="true">' + this.data[0].datas + '</div>\n      <div class="angle-down"></div>\n    </div>\n    <ul class="result">\n      ' + this.getList() + '\n    </ul>';
      this.$mount.innerHTML = template;
      this.value = this.data[0].datas;
      this.resetSelect(this.value);
      this.bindTogger();
      this.bindSelect();
    }
  }, {
    key: 'getList',
    value: function getList() {
      return this.data.reduce(function (cur, next) {
        return cur += '<li class="item">\n        <span class="hight">' + next.curValue + '</span><span class="normal">' + next.nextValue + '</span>\n      </li>';
      }, '');
    }
  }, {
    key: 'query',
    value: function query(selector) {
      return this.$mount.querySelectorAll(selector);
    }
  }, {
    key: 'bind',
    value: function bind(el, type, callback) {
      el.addEventListener(type, callback);
    }
  }, {
    key: 'toggleList',
    value: function toggleList() {
      var items = this.query(".result .item");
      var list = items.item(0).classList;
      if (list.contains('slideInLeft')) {
        items.forEach(function (item) {
          var itemList = item.classList;
          itemList.remove('slideInLeft');
          itemList.add('slideOutLeft');
          setTimeout(function () {
            item.style.display = 'none';
          }, 100);
        });
      } else if (list.contains('slideOutLeft') || !list.contains('slideInLeft') && !list.contains('slideOutLeft')) {
        items.forEach(function (item) {
          item.style.display = "list-item";
          var itemList = item.classList;
          itemList.remove('slideOutLeft');
          itemList.add('slideInLeft');
        });
      }
    }
  }, {
    key: 'toggleAngle',
    value: function toggleAngle(el) {
      el = el || this.query('.box [class*="angle"]').item(0);
      var list = el.classList;
      if (list.contains('angle-down')) {
        list.remove('angle-down');
        list.add('angle-up');
      } else {
        list.remove('angle-up');
        list.add('angle-down');
      }
      this.toggleList();
    }
  }, {
    key: 'bindTogger',
    value: function bindTogger() {
      var _this = this;

      var el = this.query('.box [class*="angle"]').item(0);
      this.bind(el, 'click', function () {
        _this.toggleAngle(el);
      });
    }
  }, {
    key: 'syncAngle',
    value: function syncAngle(open) {
      var angle = this.query('.box [class*="angle"]').item(0);
      var list = angle.classList;

      if (open) {
        list.remove('angle-down');
        list.add('angle-up');
      } else {
        list.remove('angle-up');
        list.add('angle-down');
      }
    }
  }, {
    key: 'execSearch',
    value: function execSearch(lists, item, index, keyword) {
      lists[index].style.display = 'list-item';
      lists.forEach(function (list) {
        list.classList.remove('slideOutLeft');
        list.classList.add('slideInLeft');
      });
      lists[index].firstElementChild.innerHTML = keyword;
      lists[index].lastElementChild.innerHTML = item.datas.slice(keyword.length);
      lists.hilighted = true;
      this.lastIndex = index;
      this.syncAngle(true);
    }
  }, {
    key: 'resetSearch',
    value: function resetSearch(lists, item, index) {
      lists[index].style.display = 'none';
      if (index !== this.lastIndex) {
        lists[index].firstElementChild.innerHTML = item.curValue;
        lists[index].lastElementChild.innerHTML = item.nextValue;
      }
      if (!lists.hilighted) {
        this.syncAngle(false);
        lists.forEach(function (list) {
          list.classList.remove('slideInLeft');
          list.classList.add('slideOutLeft');
        });
      }
    }
  }, {
    key: 'activeSearch',
    value: function activeSearch(keyword) {
      var _this2 = this;

      keyword = keyword.replace(/\s/g, ' ');
      if (keyword === '') this.lastIndex = null;
      var lists = this.query(".result .item");
      this.data.forEach(function (item, index) {
        if (item.datas.slice(0, keyword.length) === keyword && keyword !== '') {
          _this2.execSearch(lists, item, index, keyword);
        } else if (keyword === '' || item.datas.slice(0, keyword.length) !== keyword) {
          if (_this2.lastIndex === index && !/\s+$/.test(keyword)) {
            _this2.lastIndex = null;
          }
          _this2.resetSearch(lists, item, index);
        }
      });
    }
  }, {
    key: 'bindMount',
    value: function bindMount() {
      var _this3 = this;

      this.bind(this.$mount, 'keydown', function (e) {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      });
      this.bind(this.$mount, 'input', function (e) {
        var el = e.target;
        if (el.textContent.length > 20) {
          el.textContent = el.textContent.slice(0, 20);
        }
        if (_this3.searchable) {
          _this3.activeSearch(el.textContent);
        }
      });
    }
  }, {
    key: 'detective',
    value: function detective() {
      var lists = this.query(".result .item");
      this.syncAngle(false);
      lists.forEach(function (list) {
        list.style.display = 'none';
        list.classList.remove('slideInLeft');
        list.classList.add('slideOutLeft');
      });
    }
  }, {
    key: 'resetSelect',
    value: function resetSelect(v) {
      this.activeSearch(v);
      this.detective();
    }
  }, {
    key: 'bindSelect',
    value: function bindSelect() {
      var _this4 = this;

      this.bind(this.query(".result").item(0), 'click', function (e) {
        var el = e.target;
        var v = null;
        var target = _this4.query('.selector').item(0);
        if (el.tagName.toLowerCase() === 'span') {
          v = el.parentElement.firstElementChild.innerHTML + el.parentElement.lastElementChild.innerHTML;
        } else {
          v = el.firstElementChild.innerHTML + el.lastElementChild.innerHTML;
        }

        target.innerHTML = v;
        _this4.value = v;
        _this4.resetSelect(v);
      });
    }
  }, {
    key: 'type',
    value: function type(el) {
      return Object.prototype.toString.call(el).replace(/^\[\w+ (.+)\]$/, '$1').toLowerCase();
    }
  }, {
    key: 'verify',
    value: function verify() {
      if (!this.$mount) {
        throw new Error("无法找到 select 组件挂载点");
      }
    }
  }]);

  return Select;
}();
