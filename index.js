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
			case tests.hasUnderscore(key):
				convention = 'us';
				break;

			case tests.hasUpperCase(key):
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
			output = conventionize(data, tests.hasUnderscore, converter.underToCamel);
			break;

		case convention === 'cC' && to === null:
			output = conventionize(data, tests.hasUpperCase, converter.camelToUnder);
			break;

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
 * =================================================
 *
 * Notes:
 *  Utility methods must return anything but a Boolean.
 *
 */

const utility = {
	/**
	 * Returns camel case prop name
	 *
	 * @param val - string prop name.
	 * @param i - iteration number.
	 * @return {String} - value of camelCased prop name.
	 */
	camelMap: (val, i) => i > 0 ? val.replace(/(^|\s)[a-z]/g, utility.firstCharUpper) : val.toLowerCase(),

	/**
	 * Returns first character of each string in uppercase.
	 * @param str
	 */
	pascalMap: str => str[0] === str[0].toUpperCase() ? str : utility.firstCharUpper(str),

	/**
	 * Returns the string with the first character uppercase.
	 * @param str
	 * @return {String} - Value of string with first character uppercase.
	 */
	firstCharLower: str => str.charAt(0).toLowerCase() + str.slice(1),

	/**
	 * Returns the string with the first character uppercase.
	 * @param str
	 * @return {String} - Value of string with first character uppercase.
	 */
	firstCharUpper: str => str.charAt(0).toUpperCase() + str.slice(1),

	/**
	 * Returns array of strings split at each upper case character.
	 *
	 * @param str - String
	 */
	upperCharsSplit: str => str.split(/(?=[A-Z])/),


	/**
	 * Returns Array of strings split at each underscore.
	 * @param str - String
	 * @return {Array} - Array of string split by underscore.
	 */
	underscoreSplit: str => str.split('_'),
};


/**
 *  Tests.
 * =================================================
 *
 * Notes:
 *  Tests methods must return a Boolean.
 */

const tests = {

	/**
	 * Checks If first character is lowercase.
	 * @param str
	 * @return {Boolean} - Value of test.
	 */
	isFirstCharLower: str => str[0] === str[0].toLowerCase(),

	/**
	 *
	 * @param arr - Array of strings.
	 * @return {Boolean} - value if found any first characters lower case.
	 */
	hasLowerCases: arr => arr.filter(utility.isFirstCharLower).length > 1,

	/**
	 * Checks if str has uppercase characters
	 * @param str - String
	 * @return {Boolean} - Value of test.
	 */
	hasUpperCase: str => (/[A-Z]/.test(str)),

	/**
	 * Checks if string has at least one underscore.
	 * @param str - String
	 * @return {Boolean} - Value of test
	 */
	hasUnderscore: str => str.includes('_'),

	/**
	 * Checks if string contains an lowercase characters after split
	 * on uppercase characters.
	 *
	 * @param str - String
	 * @return {Boolean} - Value of test.
	 */
	hasFirstCharsLower: str => this.hasLowerCases(utility.upperCharsSplit(str)),

};

/**
 *  Convention Converter methods.
 * =================================================
 *
 * Notes:
 *  Converter methods must manipulate passed parameter.
 */


const converter = {

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
	underToCamel: str => utility.underscoreSplit(str).map(utility.camelMap).join(''),

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
	camelToUnder: str => str.replace(/\.?([A-Z])/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, ""),

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
	camelToPascal: str => utility.upperCharsSplit(str).map(utility.pascalMap).join(''),
};


module.exports = conventioner;