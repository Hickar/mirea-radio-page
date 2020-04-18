// @ts-check

/**
 * @template TValueType
 */
export class LongtermKeyValue {
	/**
	 * @type string
	 */
	#key = "";

	/**
	 * @type {TValueType}
	 */
	// @ts-ignore
	#defaultValue;

	/**
	 * @param {string} key Идемпотентный относительно сборки ключ
	 * @param {TValueType} defaultValue
	 */
	constructor(key, defaultValue) {
		this.#key = key;

		if (this.get() === null) {
			this.set(defaultValue);
		}
	}

	/**
	 * @returns {TValueType}
	 */
	get = () => {
		const localStorageValue = localStorage.getItem(this.#key);

		if (localStorageValue) {
			const storageValue = JSON.parse(localStorageValue);

			return storageValue;
		}

		return this.#defaultValue;
	};

	/**
	 * @param {TValueType} value
	 */
	set = value => {
		localStorage.setItem(this.#key, JSON.stringify(value));
	};

	remove = () => {
		localStorage.removeItem(this.#key);
	};
}
