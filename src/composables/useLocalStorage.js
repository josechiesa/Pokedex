export function useLocalStorage(key, defaultValue = []) {
	const read = () => {
		try {
			const stored = window.localStorage.getItem(key);
			return stored ? JSON.parse(stored) : defaultValue;
		} catch (err) {
			console.warn(err);
			return defaultValue;
		}
	};

	const save = (value) => {
		try {
			window.localStorage.setItem(key, JSON.stringify(value));
		} catch (err) {
			console.warn(err);
		}
	};

	return { read, save };
}
