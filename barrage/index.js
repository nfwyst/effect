// 渲染
function render(config) {
  $('<div></div>').text(config.val).css({
    position: 'absolute',
    color: config.color,
    left: '100%',
    top: config.position,
    fontSize: config.size,
    height: config.size,
    lineHeight: config.size,
    overflow: 'hidden'
  }).appendTo($('#container')).animate({
    left: '-100%'
  }, config.speed, 'linear', function() {
    $(this).remove();
  });
}

$(document).ready(function() {
  // or get data from server
  if (localStorage.length > 0) {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      var item = JSON.parse(localStorage.getItem(key));
      $(item).each(function(i, e) {
        render(e);
      });
    }
  }

  $('#text').keyup(function(e) {
    if (e.keyCode !== 13) {
      return false;
    }
    // 获取内部值
    var _this = $(this);
    var val = _this.val();
    if (val.length === 0) {
      return false;
    }
    _this.val('');

    // 速度设定和读取
    var speedIn = $('#speed');
    var speed = speedIn.val();
    speed = speed.length >= 4
      ? Number(speed)
      : 8000 + 4000 * Math.random();
    speedIn.val('');

    // 颜色设定和读取
    var colorIn = $('#color');
    var reg = /^rgba?\((\d+,){2}\d+(,\d?.?\d+)?\)$/;
    var color = colorIn.val();
    if (!reg.test(color)) {
      var randomA = Math.floor(Math.random() * 10) / 10;
      if (randomA < 0.5) {
        randomA += 0.4;
      }
      color = `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${randomA})`
    }
    colorIn.val('');

    // 字体设定和读取
    var sizeIn = $('#size');
    var size = sizeIn.val();
    sizeIn.val('');
    size = Number(size);
    size = typeof size === 'number' && size !== 0
      ? `${size}px`
      : '25px';

    // position
    var position = `${Math.floor(Math.random() * 100)}%`;
    var positionNum = parseInt(position);
    var sizeNum = parseInt(size);
    var percentNum = sizeNum / $(document).height() * 100;
    while (percentNum + positionNum >= 100) {
      positionNum -= percentNum;
    }
    position = `${positionNum}%`;

    // 执行弹幕
    var conf = {
      color: color,
      position: position,
      size: size,
      speed: speed,
      val: val
    }
    render(conf);
    // push data to server

    // 启用本地缓存
    if (!localStorage.getItem('barrages')) {
      localStorage.setItem('barrages', JSON.stringify([]));
    }
    var barrages = JSON.parse(localStorage.getItem('barrages'));
    barrages.push(conf);
    localStorage.setItem('barrages', JSON.stringify(barrages));
  });

  $('#clear').on('click', function(e) {
    if (localStorage.length === 0) {
      alert('缓存已经清空啦');
    } else {
      localStorage.clear();
    }
  });
});
