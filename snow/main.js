let style = (el) => {
  let styles = el.styles
  for(let key in styles) {
    el.style[key] = styles[key] 
  } 
  return el
}
let styleEl = (fn) => {
  return (styles) => {
    if (!styles.selector) {
      throw new Error('must specify the selector') 
    }
    let el = document.querySelector(styles.selector)
    delete styles.selector
    el.styles = styles
    fn(el)
    return el
  }
}
let createEl = (name) => {
  return document.createElement(name) || null
}
let appendTo = (container) => {
  return (el) => {
    if (typeof container === 'string') {
      container = document.querySelector(container) 
    }
    container.appendChild(el)
    return el
  }
}
// init style for body and init the container
appendTo(styleEl(style)({
  padding: 0,
  margin: 0,
  backgroundColor: '#eee',
  selector: 'body'
}))(createEl('div'))

// init a snow particle
let snowParticle = createEl('div')
snowParticle.styles = {
  position: 'fixed',
  top: 0,
  left: '150px',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: '#fff'
}
appendTo('body div')(style(snowParticle))

// move the snow
let move = (el) => {
  let off = ''
  if (el.offset) {
    off = el.offset 
  }
  el.styles = {
    top: parseFloat(el.style.top) + 1 + 'px',
    left: parseFloat(el.style.left) + off + 'px'
  }
  style(el)
  if (parseFloat(el.style.top) < document.documentElement.clientHeight) {
    requestAnimationFrame(function() {
      move(el)
    }) 
  }
}
move(snowParticle)

window.addEventListener('mousemove', (e) => {
  snowParticle.offset = (e.pageX / document.documentElement.clientWidth - 0.5) * 4 
})
