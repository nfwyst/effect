const { createStore, combineReducer, bindActionCreator } = require('./Redux.js');

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

const dreamUpdater = (state, action) => {
  if (action.type === 'info') {
    return action.dream
  }
  return state;
}

const childsUpdater = (state, action) => {
  if (action.type === 'info') {
    return state.concat(action.item);
  }
  return state;
}

const infoUpdater = (state, action) => {
  if (typeof state === undefined) {
    return { dream: '', childs: [] }
  }
  switch (action.type) {
    case 'info':
      return combineReducer({dream: dreamUpdater, childs: childsUpdater })(state, action);
    default:
      return state;
  }
}

const counterUpdater = (state, action) => {
  if(action.type === 'increment') {
    return action.counter
  } else {
    return state;
  }
}

const reducer = combineReducer({ name: nameUpdater, age: ageUpdater, info: infoUpdater, counter: counterUpdater });

const store = createStore(reducer, { name: 'xiao hong', age: 30 , counter: 1, info: { dream: '', childs: []} });


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
      console.log('异步任务执行结束');
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

function fetchAsync(store) {
  const next = store.dispatch;
  store.dispatch = (action) => {
    if(typeof action === 'function') {
      action(next, store.state);
    } else {
      next.call(store, action);
    }
  }
}

store.addMiddleWare([logger, fetch, fetchAsync]);

function incrementifOdd(number) {
  return (dispatch, state) => {
    const { counter } = state;
    if(counter % 2 === 0) return;
    dispatch({
      type: 'increment',
      counter: counter + number
    });
  }
}

(async () => {
  // (await store.dispatch({
  //   type: 'changeName',
  //   payload: 'xiao yang',
  //   url: 'xxxx'
  // }))
  // store.dispatch({
  //   type: '+'
  // });
  store.dispatch({
    type: 'info',
    item: 'baby',
    dream: 'to be a baby'
  });
})()

// const a = function(name) {
//   return {
//     type: 'changeName',
//     payload: name
//   };
// }
// const b = function() {
//   return {
//     type: '+'
//   }
// }

store.dispatch(incrementifOdd(3));

// const actions = bindActionCreator({a,b}, store.dispatch);
// actions.a('xiao miaomi');
// actions.b();
