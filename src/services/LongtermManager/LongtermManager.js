// @ts-check

import { LongtermKeyValue } from "./LongtermKeyValue";

/**
 * @template {{[s: string]: LongtermKeyValue<any>}} TMap
 */
class LongtermManager {
  /**
   * @type {TMap}
   */

  #map;

  /**
   * @param {TMap} map
   */
  constructor(map) {
    this.#map = map;
  }

  /**
   * @template {keyof TMap} TKey
   * @param {TKey} key
   * @returns {ReturnType<TMap[TKey]['get']>}
   */
  get = key => {
    return this.#map[key].get();
  };

  /**
   * @template {keyof TMap} TKey
   * @param {TKey} key
   * @param {Parameters<TMap[TKey]['set']>[0]} value
   */
  set = (key, value) => {
    this.#map[key].set(value);
  };

  /**
   * @template {keyof TMap} TKey
   * @param {TKey} key
   * @returns {TMap[TKey]}
   */
  extract = key => {
    return this.#map[key];
  };

  remove = () => {
    Object.keys(this.#map).forEach(key => {
      this.#map[key].remove();

      delete this.#map[key];
    });
  };
}

export const Longterm = new LongtermManager({
  /**
   * @type {LongtermKeyValue<'white' | 'dark'>}
   */
  // @ts-ignore
  theme: new LongtermKeyValue("__THEME__", "white"),

  volume: new LongtermKeyValue("__VOLUME__", 0.5),

  isMuted: new LongtermKeyValue("__IS_MUTED__", false),
});
