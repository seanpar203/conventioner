'use strict';
/**
 * A Helper function for converting data from and to language conventions with ease.
 *
 * Example:
 *
 * let data = { someProp: 'Awesome', anotherProp: 'cool'};
 *
 * $http.post('some-url', conventioner(data))
 *      .then(res => setUpdate(conventioner(res.data)))
 *
 * // Sent object looks like - {some_prop: 'Awesome', another_prop: 'cool'}
 *
 * This non trivial example shows how easy it is to keep language conventions consistent.
 *
 * @param data - Single level Object
 * @returns {} - Single level Object to language convention.
 */
const conventioner = data => {
	/**
	 * Default Variables.
	 */
	let output = {};
	let convention = 'neutral';
	const dataLength = Object.keys(data).length;

	/**
	 * Returns true if string has upper case characters.
	 * @param str
	 */
	const hasUpperCase = str => (/[A-Z]/.test(str));


	/**
	 * Takes underscored prop name and converts it to
	 * camelCased prop name.
	 *
	 * @param str - value of key prop name.
	 * @returns {string} - camelCased prop name.
	 *
	 * Resource:
	 *   https://www.sitepoint.com/community/t/capitalizing-first-letter-of-each-word-in-string/209644/5
	 *
	 * Credit:
	 *   felgall
	 */
	const underToCamel = (str) => {
		return str
			.split('_')
			.map((val, indx) => {
				return indx > 0
					? val.replace(/(^|\s)[a-z]/g, v => v.toUpperCase())
					: val
			})
			.join('')
	};

	/**
	 * Takes camelCase prop name and converts it to underscore
	 * prop name.
	 *
	 * @param str - value of key prop name.
	 * @returns {*} - underscore prop name.
	 *
	 * Resource:
	 *  http://stackoverflow.com/questions/30521224/javascript-convert-pascalcase-to-underscore-case
	 *
	 * Credit:
	 *  Avinash Raj
	 */
	const camelToUnder = str => {
		return str.replace(/\.?([A-Z])/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, "");
	};

	/**
	 * Loop to determine what convention is being used
	 * from the data passed in.
	 */
	for (let i = 0; i < dataLength; i += 1) {
		const key = Object.keys(data)[i];

		switch (key !== null) {
			case key.includes('_'):
				convention = 'underscore';
				break;

			case hasUpperCase(key):
				convention = 'camelCase';
				break;

		}
	}

	/**
	 * underscore to camelCase.
	 */
	if (convention === 'underscore') {
		for (let i = 0; i < dataLength; i += 1) {
			let key = Object.keys(data)[i];
			const val = data[key];

			if (key.includes('_')) {
				key = underToCamel(key);
			}

			output[key] = val;
		}
	}

	/**
	 * camelCase to underscore.
	 */
	if (convention === 'camelCase') {
		for (let i = 0; i < dataLength; i += 1) {
			let key = Object.keys(data)[i];
			const val = data[key];

			if (hasUpperCase(key)) {
				key = camelToUnder(key);
			}

			output[key] = val;
		}
	}

	/**
	 * Default, if no convention matches found.
	 */
	if (convention === 'neutral') {
		output = data;
	}

	return output;
};

module.exports = conventioner;