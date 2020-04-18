export class CallbacksPool {
  #pool = new Set();

  add = callback => {
    this.#pool.add(callback);
  };

  delete = callback => {
    this.#pool.delete(callback);
  };

  clear = () => {
    this.#pool.clear();
  };

  invoke = payload => {
    this.#pool.forEach(callback => callback(payload));
  };
}
