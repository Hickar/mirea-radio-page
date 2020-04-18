import { BaseTheme } from "./BaseTheme";
import { CallbacksPool } from "../CallbacksPool";

export class ThemesManager {
  #map;
  #currentTheme;
  #getNextTheme;
  #onChangeCallbacksPool = new CallbacksPool();

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

  onThemeChanged = callback => {
    this.#onChangeCallbacksPool.add(callback);
  };
}
