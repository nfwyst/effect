const EventEmitter = require('./EventEmitter.js');

module.exports = class Redux extends EventEmitter{
  constructor(state = {}) {
    super();
    this._state = state;
  }

  get state() {
    return JSON.parse(JSON.stringify(this._state));
  }

  setUpdaters(updaters = () => {}) {
    this.updaters = updaters;
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
}