class Select {
  constructor({
    id = 'container',
    data = [],
    searchable = true,
  } = {}) {
    this.value = null;
    this.lastIndex = null;
    this.browser = true;
    try {
      this.$mount = document.querySelector(`#${id}`);
    } catch(e) {
      this.browser = false;
    }
    this.data =  this.transData(data);
    this.searchable = searchable;
    this.init();
  }

  transData(data) {
    if(!data.map) return [];
    return data.map((item, index) => {
      return {
        curValue: '',
        nextValue: item,
        datas: item
      }
    });
  }

  init() {
    if(this.browser) {
      this.verify();
      this.bindMount();
      this.render();
    }
  }

  load(vals) {
    this.data = this.transData(vals);
    this.render();
  }

  render() {
    if(this.data.length === 0) return false;
    this.$mount.innerHTML = '';
    const template = `
    <div class="box">
      <div class="selector" contenteditable="true">${this.data[0].datas}</div>
      <div class="angle-down"></div>
    </div>
    <ul class="result">
      ${this.getList()}
    </ul>`;
    this.$mount.innerHTML = template;
    this.value = this.data[0].datas;
    this.resetSelect(this.value);
    this.bindTogger();
    this.bindSelect();
  }

  getList() {
    return this.data.reduce((cur, next) => {
      return (cur += `<li class="item">
        <span class="hight">${ next.curValue }</span><span class="normal">${ next.nextValue }</span>
      </li>`);
    }, '');
  }

  query(selector) {
    return this.$mount.querySelectorAll(selector);
  }

  bind(el, type, callback) {
    el.addEventListener(type, callback);
  }

  toggleList() {
    let items = this.query(".result .item");
    let list = items.item(0).classList;
    if(list.contains('slideInLeft')) {
      items.forEach((item) => {
        let itemList = item.classList;
        itemList.remove('slideInLeft');
        itemList.add('slideOutLeft');
        setTimeout(() => {
          item.style.display = 'none';
        }, 100);
      })
    } else if(list.contains('slideOutLeft') || !list.contains('slideInLeft') && !list.contains('slideOutLeft')) {
      items.forEach((item) => {
        item.style.display = "list-item";
        let itemList = item.classList;
        itemList.remove('slideOutLeft');
        itemList.add('slideInLeft');
      })
    }
  }

  toggleAngle(el) {
    el = el || this.query('.box [class*="angle"]').item(0);
    let list = el.classList;
    if(list.contains('angle-down')) {
      list.remove('angle-down');
      list.add('angle-up');
    } else {
      list.remove('angle-up');
      list.add('angle-down');
    }
    this.toggleList();
  }

  bindTogger() {
    var el = this.query('.box [class*="angle"]').item(0);
    this.bind(el, 'click', () => {
      this.toggleAngle(el);
    });
  }

  syncAngle(open) {
    let angle = this.query('.box [class*="angle"]').item(0);
    let list = angle.classList;

    if(open) {
      list.remove('angle-down');
      list.add('angle-up');
    } else {
      list.remove('angle-up');
      list.add('angle-down');
    }
  }

  execSearch(lists, item, index, keyword) {
    lists[index].style.display = 'list-item';
    lists.forEach(list => {
      list.classList.remove('slideOutLeft');
      list.classList.add('slideInLeft');
    })
    lists[index].firstElementChild.innerHTML = keyword;
    lists[index].lastElementChild.innerHTML = item.datas.slice(keyword.length);
    lists.hilighted = true;
    this.lastIndex = index;
    this.syncAngle(true);
  }

  resetSearch(lists, item, index) {
    lists[index].style.display = 'none';
    if(index !== this.lastIndex) {
      lists[index].firstElementChild.innerHTML = item.curValue;
      lists[index].lastElementChild.innerHTML = item.nextValue;
    }
    if (!lists.hilighted) {
      this.syncAngle(false);
      lists.forEach(list => {
        list.classList.remove('slideInLeft');
        list.classList.add('slideOutLeft');
      })
    }
  }

  activeSearch(keyword) {
    keyword = keyword.replace(/\s/g, ' ');
    if (keyword === '')  this.lastIndex = null;
    let lists = this.query(".result .item");
    this.data.forEach((item, index) => {
      if (item.datas.slice(0, keyword.length) === keyword && keyword !== '' ) {
        this.execSearch(lists, item, index, keyword);
      } else if (keyword === '' || item.datas.slice(0, keyword.length) !== keyword) {
        if(this.lastIndex === index && !/\s+$/.test(keyword)) {
          this.lastIndex = null;
        }
        this.resetSearch(lists, item, index);
      }
    })
  }

  bindMount() {
    this.bind(this.$mount, 'keydown', (e) => {
      if(e.keyCode === 13) {
        e.preventDefault();
      }
    });
    this.bind(this.$mount, 'input', (e) => {
      let el = e.target;
      if(el.textContent.length > 20) {
        el.textContent = el.textContent.slice(0, 20);
      }
      if(this.searchable) {
        this.activeSearch(el.textContent);
      }
    })
  }

  detective() {
    let lists = this.query(".result .item");
    this.syncAngle(false);
    lists.forEach(list => {
      list.style.display = 'none';
      list.classList.remove('slideInLeft');
      list.classList.add('slideOutLeft');
    })
  }

  resetSelect(v) {
    this.activeSearch(v);
    this.detective();
  }

  bindSelect() {
    this.bind(this.query(".result").item(0), 'click', (e) => {
      let el = e.target;
      let v = null;
      let target = this.query('.selector').item(0);
      if(el.tagName.toLowerCase() === 'span') {
        v = el.parentElement.firstElementChild.innerHTML + el.parentElement.lastElementChild.innerHTML;
      } else {
        v = el.firstElementChild.innerHTML + el.lastElementChild.innerHTML;
      }

      target.innerHTML = v;
      this.value = v;
      this.resetSelect(v);
    });
  }

  type(el) {
    return Object.prototype.toString.call(el).replace(/^\[\w+ (.+)\]$/, '$1').toLowerCase();
  }

  verify() {
    if (!this.$mount) {
      throw new Error("无法找到 select 组件挂载点");
    }
  }
}

export default Select
