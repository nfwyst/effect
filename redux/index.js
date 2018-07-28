const Redux = require('./Redux.js');

const store = new Redux({ name: 'xiao ming', age: 20 });

const nameUpdater = (state, action) => {
  switch (action.type) {
    case 'changeName':
      return action.payload
    default:
      return state;
  }
}
const ageUpdater = (state, action) => {
  switch (action.type) {
    case '+':
      return state + 1
    case '-':
      return state - 1
    default:
      return state;
  }
}

// 注册 reducer
store.setUpdaters({
  name: nameUpdater,
  age: ageUpdater
});

// 注册监听
store.on('change', (state) => {
  console.log(state);
});

// 定义中间件
function logger (store) {
  const next = store.dispatch;
  store.dispatch = async (action) => {
    if(!action.url) {
      console.log('开始执行同步命令');
      next.call(store, action);
      console.log('同步命令执行结束');
      return store;
    } else {
      console.log('开始执行异步任务');
      await next.call(store, action);
      console.log('异步任务执行结束')
    }
    return store;
  }
}
function fetch(store) {
  const next = store.dispatch;
  store.dispatch = async (action) => {
    if(action.url) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          action.payload = 'from ajax';
          next.call(store, action);
          resolve();
        }, 1000);
      });
    } else {
      next.call(store, action)
    }
    return store;
  }
}

store.addMiddleWare([logger, fetch]);

(async () => {
  (await store.dispatch({
    type: 'changeName',
    payload: 'xiao yang',
    url: 'xxxx'
  })).dispatch({
    type: '+'
  });
})()
