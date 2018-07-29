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
function logger ({ dispatch }) {
  return async action => {
    if (!action.url) {
      console.log('开始执行同步命令');
      dispatch.call(store, action);
      console.log('同步命令执行结束');
      return store;
    } else {
      console.log('开始执行异步任务');
      await dispatch.call(store, action);
      console.log('异步任务执行结束');
    }
    return store;
  }
}
function fetch({ dispatch }) {
  return async (action) => {
    if(action.url) {
      await new Promise((resolve) => {
        setTimeout(() => {
          action.payload = 'from ajax';
          dispatch(action);
          resolve();
        }, 1000);
      });
    } else {
      dispatch(action);
    }
    return store;
  }
}

function fetchAsync({ dispatch, state }) {
  return (action) => {
    if(typeof action === 'function') {
      action(dispatch, state);
    } else {
      dispatch(action);
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
