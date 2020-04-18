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
	 * @param {string} key Идемпотентный относительно сборки ключ
	 * @param {TValueType} initialValue
	 */
	constructor(key, initialValue) {
		this.#key = key;

		if (this.get() === null) {
			this.set(initialValue);
		}
	}

	/**
	 * @returns {TValueType | null}
	 */
	get = () => {
		const localStorageValue = localStorage.getItem(this.#key);

		if (localStorageValue) {
			const storageValue = JSON.parse(localStorageValue);

			return storageValue;
		}

		return null;
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
