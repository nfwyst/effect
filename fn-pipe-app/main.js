function curry(fn, num, isChildNode) {
  var arglist = [];
  if(typeof fn !== 'function') return false;
  var pas = fn
      .toString()
      .match(/\((.*)\)/)[1]
      .split(",").length || 0;
  if(num && typeof num === 'number') {
    pas = num;
  }
  return function(a) {
      if(!isChildNode) {
        pas = fn.toString()
                .match(/\((.*)\)/)[1]
                .split(",").length || 0;
        arglist = [];
      }
      // console.log(a, pas, arglist, '12行');
      if(arguments.length < pas) {
        pas -= arguments.length;
        arglist = arglist.concat(Array.from(arguments).slice(1));
      } else {
        return fn.apply(null, Array.from(arguments));
      }
      return curry(function () {
        arglist = arglist.concat(Array.from(arguments));
        arglist.unshift(a);
        // console.log(a, pas, arglist, '22行');
        var response = fn.apply(null, arglist);
        if (!isChildNode) {
          pas = fn
            .toString()
            .match(/\((.*)\)/)[1]
            .split(",").length || 0;
          arglist = [];
        }
        return response;
      }, pas, true);
  }
}

function compose(...args) {
  return function(arg) {
    var fns = args.reverse();
    if(args.length > 1) {
      return fns.slice(1).reduce((cur, next) => {
        return () => {
          var res = cur(arg);
          if(!res) return false;
          else {
            return next(res);
          }
        };
      }, fns[0])();
    } else {
      return args[0](arg);
    }
  }
}

var prop = curry(function(property, obj) {
  return obj[property];
});

var map = curry(function(fn, datas) {
  if(datas instanceof Array) {
    return datas.map(fn);
  } else {
    return [fn(datas)];
  }
});

var datas = {
  item: {
    urls: [
      'http://baidu.com/1.png',
      'http://baidu.com/2.png',
      'http://baidu.com/3.png',
      'http://baidu.com/4.png',
      'http://baidu.com/5.png',
      'http://baidu.com/6.png',
      'http://baidu.com/7.png',
    ]
  }
}

var getJSON = curry(function(callback, url) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.setRequestHeader('Content-Type', 'json');
    xhr.onload = callback;
    xhr.send();
});

var setHtml = curry(function(ele, html) {
    ele.innerHTML = html;
    return ele;
});

var appendHtml = curry(function(ele, html) {
  ele.insertAdjacentHTML('beforeend', html);
  return ele;
});

function urlToImg(url) {
  return `<img src="${url}" />`
}

function getUrl() {
  return `https://zhihu-daily.leanapp.cn/api/v1/last-stories`;
}

var trace = curry(function(tag, x) {
  console.log(tag, x);
  return x;
});

var toJson = function(xhrEvent) {
  return JSON.parse(xhrEvent.target.responseText);
}


function mapToStrList(data) {
  return `
    <ul id="story-list">
      ${data.STORIES.stories.map(item => {
        return `<li id="${item.id}">
          <header role="title">${item.title}</header>
          <main>${item.images.map(img => `<img src="${img}" />`).join('')}</main>
        </li>`
      }).join('')}
    </ul>
  `
}

function getArticleUrl(e) {
  if(e.target.localName === 'li') {
    return `https://zhihu-daily.leanapp.cn/api/v1/contents/${e.target.id}`;
  } else if(e.target.localName === 'ul') {
    return false;
  } else {
    return `https://zhihu-daily.leanapp.cn/api/v1/contents/${e.target.parentElement.id}`;
  }
}

function mapToStrArticle(data) {
  return `
    ${data.CONTENTS.css
      .map(item => {
        return `<link rel="stylesheet" type="text/css" href="${item}" />`;
      })
      .join("")}
    ${data.CONTENTS.body.replace(/<\w+\s+\w+="img-place-holder"><\/\w+>/, `
      <div class="img-place-holder">
        <img src="${data.CONTENTS.image}" />
      </div>
    `)}
  `;
}

function hideTitle(data) {
  document.querySelector('#story-list').style.display = 'none';
  return data;
}

var bindListClick = curry(function (callback, el) {
  el.querySelector('#story-list').onclick = callback;
});


var renderArticle = compose(appendHtml(document.body), hideTitle, mapToStrArticle, trace('文章详情返回的结果是: '), toJson);

var articleApp = compose(getJSON(renderArticle), getArticleUrl);

var bindEvent = compose(bindListClick(articleApp));

var renderList = compose(bindEvent, setHtml(document.body), mapToStrList, trace('返回的结果是: '), toJson);

var app = compose(getJSON(renderList), trace('请求的 url 是: '), getUrl);


window.onload = app;
