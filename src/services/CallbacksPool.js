// @ts-check

/**
 * @template TPayloadType
 */
export class CallbacksPool {
  /**
   * @type {Set<(payload: TPayloadType) => void>}
   */
  #pool = new Set();

  /**
   * @param {(payload: TPayloadType) => void} callback
   */
  add = callback => {
    this.#pool.add(callback);
  };

  /**
   * @param {(payload: TPayloadType) => void} callback
   */
  delete = callback => {
    this.#pool.delete(callback);
  };

  clear = () => {
    this.#pool.clear();
  };

  /**
   * @param {TPayloadType} payload
   */
  invoke = payload => {
    this.#pool.forEach(callback => callback(payload));
  };
}
