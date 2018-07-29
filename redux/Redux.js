const EventEmitter = require('./EventEmitter.js');

module.exports = class Redux extends EventEmitter {
  constructor(state = {}) {
    super();
    this._state = state;
    this.dispatch = this.dispatch.bind(this);
  }

  get state() {
    return JSON.parse(JSON.stringify(this._state));
  }

  static bindActionCreator(actions, dispatch) {
    const result = {};
    Object.keys(actions).forEach(key => {
      result[key] = (...args) => {
        dispatch(actions[key](...args));
      }
    });
    return result;
  }

  static combineReducer(reducers) {
    return (state, action) => {
      let newState = {};
      Object.keys(reducers).forEach(key => {
        newState[key] = reducers[key](state[key], action);
      });
      return newState;
    };
  }

  static createStore(updaters, initialState) {
    if(typeof initialState === 'function') {
      return initialState(Redux.createStore)(updaters, undefined);
    }
    if (!Redux.instance) {
      Redux.instance = new Redux(initialState).setUpdaters(updaters);
    }
    return Redux.instance;
  }

  setUpdaters(updaters = () => {}) {
    if (this.updaters) return this;
    this.updaters = updaters;
    return this;
  }

  dispatch(action) {
    if (typeof this.updaters === "function") {
      this._state = this.updaters(this.state, action);
    } else {
      let newState = {
        ...this.state
      };
      Object.keys(this.updaters).forEach(key => {
        newState[key] = this.updaters[key](this.state[key], action);
      });
      this._state = newState;
    }
    this.emit("change", this.state);
    return this;
  }

  addMiddleWare(middles) {
    if (typeof middles === "function") {
      this.dispatch = middles(this);
    } else if (middles instanceof Array) {
      middles.reverse().forEach(middle => {
        this.dispatch = middle(this);
      });
    }
  }

  applyMiddleWare(...args) {
    return creator => (updaters, initialState) => {
        const store = creator(updaters, initialState);
        store.addMiddleWare(args);
        return store;
    }
  }

  static connect(getState, getActions) {
    return Component => props => {
      let state = getState(props.store.state);
      let actions = getActions();
      props.store.on('change', () => { Component.prototype = Object.assign({}, Component.prototype, getState(props.store.state)) });
      Component.prototype = Object.assign({}, Component.prototype, state, actions);
      return Component;
    }
  }
};
