class Vue {
  constructor({ el, data }) {
    this.__data__ = data // 需要监听的数据对象
    this.__el__ = document.querySelector(el) // app 根元素
    this.bind() // 初始化
  }
  bind() {
    this.view = new View(this.__data__) // 初始化一个视图用于响应数据的变化并渲染
    for(let key in this.__data__) {
      Object.defineProperty(this, key, {
        set(val) {
          this.emit(key, val) // 数据有变化则重新渲染
          this.__data__[key] = val
        },
        get() {
          return this.__data__[key]
        }
      })
      this.emit(key, this.__data__[key]) // 初始属性渲染到页面上
    }
  }
  traverse(el, key) { // 对 DOM 进行遍历 进行初次渲染, 并将data的属性和DOM元素绑定
    el.childNodes.forEach((node) => {
      if(!node.hasChildNodes() && new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`).test(node.textContent)) {
        node.innerText = this.__data__[key]
        this.view.addNode(key, node)
      } else {
        this.traverse(node, key)
      }
    })
  }
  emit(key, value) { // 响应数据变化
    if (!this[key].traversed) { // 如果当前属性已经绑定到对应的 DOM 元素上则不再遍历 DOM
      this.traverse(this.__el__, key)
    }
    this.view[key].traversed = true
    this.view.render(key, value) // 渲染
  }
}
class View {
  constructor(data) {
    for(let key in data) { this[key] = [] }
  }
  addNode(key, node) {
    this[key].push(node)
  }
  render(key, value) {
    this[key].forEach(el => {
      el.textContent = value;
    })
  }
}
