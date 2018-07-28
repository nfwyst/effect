module.exports = class {
  constructor() {
    this._eventMap = new Map();
  }
  on(type, fn) {
    const pass = typeof type === 'string' && typeof fn === 'function';
    if (!pass) {
      throw new Error('type must be string, fn must be function');
    }

    const exist = this._eventMap.get(type);
    exist ? this._eventMap.get(type).unshift(fn) : this._eventMap.set(type, [].concat(fn));

    return this;
  }
  emit(type, data) {
    const exist = this._eventMap.get(type);
    exist ? this.emitter(exist, data) : false;
  }
  emitter(ls, data) {
    ls.forEach(fn => {
      fn(data);
    });
  }
}
