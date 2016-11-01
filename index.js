'use strict';

/**
 * A Helper function for converting data from and to language conventions with ease.
 *
 * @param data - Single level Object
 * @param to - Optional value to force specific convention.
 * @returns {Object} - Single level Object to language convention.
 */
const conventioner = (data, to) => toConvention(fromConvention(data), to);

/**
 * Finds convention by analyzing data props.
 * @param data - object to find convention.
 * @returns {Array} - name of convention
 */
const fromConvention = (data) => {
	let convention = 'neutral';
	for (let i = 0; i < Object.keys(data).length; i += 1) {
		const key = Object.keys(data)[i];

		switch (key !== null) {
			case key.includes('_'):
				convention = 'us';
				break;

			case hasUpperCase(key):
				convention = 'cC';
				break;

		}
	}
	return [convention, data];
};

/**
 *
 * @param from - Array of results from convention.
 * @param to - Optional value to force certain convention.
 * @returns {Object} - Value of to convention.
 */
function toConvention(from, to = null) {
	let [convention, data] = from;
	let output = {};

	if (to !== null) {
		convention = to;
	}

	switch (convention !== null) {

		case convention === 'us' && to === null:
			output = conventionize(data, hasUnderscore, underToCamel);
			break;

		case convention === 'cC' && to === null:
			output = conventionize(data, hasUpperCase, camelToUnder);
			break;

		case convention === 'cC' && to === 'PC':

		case convention === 'neutral':
			output = data;
			break;
	}

	return output;
}

/**
 * Generic method that converts object prop names.
 *
 * @param data - object to change conventions.
 * @param test - test case to check if matches convention.
 * @param converter - method to convert prop name to desired.
 * @return {Object} - Value of converted conventions.
 */
const conventionize = (data, test, converter) => {
	let output = {};
	for (let i = 0; i < Object.keys(data).length; i += 1) {
		let key = Object.keys(data)[i];
		const val = data[key];

		if (test(key)) {
			key = converter(key);
		}

		output[key] = val;
	}
	return output;
};

/**
 * Utility Methods.
 * ============================================================================
 */

/**
 * Returns the string with the first character uppercase.
 * @param str
 * @return {String} - Value of string with first character uppercase.
 */
const firstCharUpper = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Returns array of strings split at each upper case character.
 *
 * @param str
 */
const upperCharsSplit = str => str.split(/(?=[A-Z])/);


/**
 *
 * @param arr - Array of strings.
 * @return {boolean} - value if found any first characters lower case.
 */
const hasLowerCases = arr => {
	let found = false;

	if (arr.length > 1) {

		for (let i = 0; i < arr.length; i += 1) {
			let str = arr[i];
			if (str[0] === str[0].toLowerCase()) {
				found = true;
				break;
			}
		}

	}
	return found;
};

/**
 *  Convention Tests.
 * ============================================================================
 */

/**
 * Returns true if string has upper case characters.
 * @param str
 */
const hasUpperCase = str => (/[A-Z]/.test(str));

/**
 * Return true if string has at least one underscore.
 * @param str
 */
const hasUnderscore = str => str.includes('_');


/**
 * Returns true if string has lower cases after Upper characters split.
 * @param str
 */
const hasFirstCharsLower = str => hasLowerCases(upperCharsSplit(str));

/**
 *  Convention Converter methods.
 * ============================================================================
 */

/**
 *  underscore Converters.
 * ===============================
 */

/**
 * Takes underscored prop name and converts it to camelCased prop name.
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
const underToCamel = str => str.split('_').map(camelMap).join('');

/**
 *  camelCase Converters.
 * ===============================
 */

/**
 * Returns camel case prop name
 *
 * @param val - string prop name.
 * @param indx - iteration number.
 * @return {String} - value of camelCased prop name.
 */
const camelMap = (val, indx) => indx > 0 ? val.replace(/(^|\s)[a-z]/g, firstCharUpper) : val;

/**
 * Takes camelCase prop name and converts it to underscore prop name.
 *
 * @param str - value of key prop name.
 * @returns {String} - underscore prop name.
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
 *  PascalCase Converters.
 * ===============================
 */

/**
 * Splits strings at upper case & returns PascalCase string.
 * @param str
 * @return {String} - PascalCase string.
 *
 * Resource:
 *  http://stackoverflow.com/questions/7888238/javascript-split-string-on-uppercase-characters
 *
 * Credit:
 *  Teneff
 */
const camelToPascal = str => upperCharsSplit(str).map(camelToPascalMap).join('');

/**
 * Returns first character of each string in uppercase.
 * @param str
 */
const camelToPascalMap = str => str[0] === str[0].toUpperCase() ? str : firstCharUpper(str);


module.exports = conventioner;