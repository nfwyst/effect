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

store.dispatch({
  type: 'changeName',
  payload: 'xiao yang'
}).dispatch({
  type: '+'
});
