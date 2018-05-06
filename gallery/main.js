window.onload = () => {
  const query = (selector) => {
    return document.querySelectorAll(selector);
  }
  const opacity = .4;
  const imgs = query('.imgs img');

  const resetOpacity = (container) => {
    let imgs = container.querySelectorAll('img');
    Array.prototype.map.call(imgs, img => {
      img.style.opacity = 1;
    });
  }

  const setOpacity = (el) => {
    return el ?
      el.style.opacity = opacity
      : this.style.opacity = opacity;
  }

  // const presetTransition = (el) => {
  //   el.style.transition = 'none';
  //   el.style.opacity = 0;
  // }

  const nextTick = (fn) => {
    return (time) => {
      setTimeout(fn, time);
    }
  }

  // const resetTransition = (el) => {
  //   el.style.transition = '';
  //   el.style.opacity = 1;
  // }

  const clickHandler = (e) => {
    // presetTransition(current);
    if (e.target.getAttribute('src')) {
      current.src = e.target.src;
      resetOpacity(e.target.parentElement.parentElement);
      setOpacity.call(e.target, e.target);
      // nextTick(resetTransition)(300);

      current.classList.add('fade-in');
      nextTick(() => {
        current.classList.remove('fade-in');
      })(500);
    }
  }

  // init
  query('.imgs').item(0).addEventListener('click', clickHandler, false)
  nextTick(() => {
    current.style.opacity = 1;
    imgs.item(0).style.opacity = opacity;
  })(1);
}
