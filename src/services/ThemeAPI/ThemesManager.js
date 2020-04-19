// @ts-check

import { BaseTheme } from "./BaseTheme";
import { CallbacksPool } from "../CallbacksPool";

/**
 * @template {{[s: string]: BaseTheme}} TMap
 */
export class ThemesManager {
  /**
   * @typedef {keyof TMap} Theme
   */

  /**
   * @type {TMap}
   */
  #map;

  /**
   * @type {Theme}
   */
  #currentTheme;

  /**
   * @type {((currentTheme: Theme) => Theme) | undefined}
   */
  #getNextTheme;

  /**
   * @type {CallbacksPool<Theme>}
   */
  #onChangeCallbacksPool = new CallbacksPool();

  /**
   * @param {TMap} map
   * @param {Theme} initialTheme
   * @param {(currentTheme: Theme) => Theme=} getNextTheme
   */
  constructor(map, initialTheme, getNextTheme) {
    this.#map = map;
    this.#currentTheme = initialTheme;

    this.#getNextTheme = getNextTheme;
  }

  get currentTheme() {
    return this.#currentTheme;
  }

  setNext = () => {
    if (this.#getNextTheme) {
      const nextTheme = this.#getNextTheme(this.#currentTheme);

      return this.set(nextTheme);
    }
  };

  /**
   * @param {Theme} theme
   */
  set = async theme => {
    const currentThemeInstance = this.#map[this.#currentTheme];
    const nextThemeInstance = this.#map[theme];

    if (!nextThemeInstance.isLoaded) {
      await nextThemeInstance.load();
    }

    currentThemeInstance.cleanup(nextThemeInstance);

    nextThemeInstance.set(currentThemeInstance);

    this.#currentTheme = theme;

    this.#onChangeCallbacksPool.invoke(theme);

    return theme;
  };

  /**
   * @param {(theme: Theme) => void} callback
   */
  onThemeChanged = callback => {
    this.#onChangeCallbacksPool.add(callback);
  };
}
