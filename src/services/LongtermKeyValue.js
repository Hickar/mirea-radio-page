export class LongtermKeyValue {
	#key = "";
	#defaultValue;

	constructor(key, defaultValue) {
		this.#key = key;
		this.#defaultValue = defaultValue;

		if (this.get() === null) {
			this.set(defaultValue);
		}
	}

	get = () => {
		const localStorageValue = localStorage.getItem(this.#key);
		if (localStorageValue) {
			const storageValue = JSON.parse(localStorageValue);
			return storageValue;
		}

		return this.#defaultValue;
	};

	set = value => {
		localStorage.setItem(this.#key, JSON.stringify(value));
	};

	remove = () => {
		localStorage.removeItem(this.#key);
	};
}
