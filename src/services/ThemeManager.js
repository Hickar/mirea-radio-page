// @ts-check

import { LongtermKeyValue } from "./LongtermKeyValue";

/**
 * @typedef {'white' | 'dark'} Theme
 */

/**
 * @type {{
		white: "dark",
		dark: "white"
	}}
*/
const NEXT_THEME_MAP = {
	white: "dark",
	dark: "white"
};

class ThemeManager {
	/**
	 * @type {Array<(theme: Theme) => void>}
	 */
	#onChangeCallbacks = [];

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
		this.#onChangeCallbacks.push(callback);
	};

	invokeOnChangeCallbacks = () => {
		const theme = this.theme;

		for (const callback of this.#onChangeCallbacks) {
			callback(theme);
		}
	};
}

export const Theme = new ThemeManager("white");
