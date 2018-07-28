const EventEmitter = require('./EventEmitter.js');

module.exports = class Redux extends EventEmitter{
  constructor(state = {}) {
    super();
    this._state = state;
  }

  get state() {
    return JSON.parse(JSON.stringify(this._state));
  }

  static combineReducer(reducers) {
    return (state, action) => {
      let newState = {};
      Object.keys(reducers).forEach(key => {
        newState[key] = reducers[key](state[key], action);
      });
      return newState;
    }
  }

  static createStore(updaters, initialState) {
    if(!Redux.instance) {
      Redux.instance = new Redux(initialState).setUpdaters(updaters);
    }
    return Redux.instance;
  }

  setUpdaters(updaters = () => {}) {
    if(this.updaters) return this;
    this.updaters = updaters;
    return this;
  }

  dispatch(action) {
    if (typeof this.updaters === 'function') {
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
    this.emit('change', this.state);
    return this;
  }

  addMiddleWare(middles) {
    if (typeof middles === 'function') {
      middles(this);
    } else if(middles instanceof Array) {
      middles.reverse().forEach(middle => {
        middle(this);
      });
    }
  }
}
