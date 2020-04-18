// @ts-check

import { LongtermKeyValue } from "./LongtermKeyValue";
import { CallbacksPool } from "./CallbacksPool";

/**
 * @typedef {'white' | 'dark'} Theme
 */

/**
 * @type {{[ Key in Theme ]: Theme}}
*/
const NEXT_THEME_MAP = {
	white: "dark",
	dark: "white"
};

class ThemeManager {
	/**
	 * @type {CallbacksPool<Theme>}
	 */
	#onChangeCallbacksPool = new CallbacksPool();

	/**
	 * @param {Theme} defaultTheme
	 */
	constructor(defaultTheme) {
		this.longtermTheme = new LongtermKeyValue("__THEME__", defaultTheme);
	}

	get theme() {
		return this.longtermTheme.get();
	}

	/**
	 * @param {Theme} theme
	 */
	set = theme => {
		this.longtermTheme.set(theme);

		this.invokeOnChangeCallbacks();
	};

	setNext = () => {
		const nextThemeMap = NEXT_THEME_MAP;

		const nextTheme = nextThemeMap[this.theme];

		this.longtermTheme.set(nextTheme);

		this.invokeOnChangeCallbacks();

		return nextTheme;
	};

	/**
	 * @param {(theme: Theme) => void} callback
	 */
	onChange = callback => {
		this.#onChangeCallbacksPool.add(callback);
	};

	invokeOnChangeCallbacks = () => {
		this.#onChangeCallbacksPool.invoke(this.theme)
	};
}

export const Theme = new ThemeManager("white");
