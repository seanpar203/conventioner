'use strict';

/**
 * A Helper function for converting data from and to language conventions with ease.
 *
 * @param data - Single level Object
 * @param to - Optional value to force specific convention.
 * @returns {Object} - Single level Object to language convention.
 */
const conventioner = (data, to = null) => toConvention(fromConvention(data), to);

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
				convention = '_';
				break;

			case tests.isFirstCharLower(key) && tests.hasUpperCase(key):
				convention = 'cC';
				break;

			case tests.isFirstCharUpper(key):
				convention = 'PC';
				break
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
function toConvention(from, to) {
	let [convention, data] = from;
	let output = {};

	switch (convention !== null) {

		case convention === '_' && to === null:
			output = conventionize(data, tests.hasUnderscore, converter.underToCamel);
			break;

		case convention === 'cC' && to === null:
			output = conventionize(data, tests.hasUpperCase, converter.camelToUnder);
			break;

		case convention === 'PC' && to === null:
			output = conventionize(data, tests.isFirstCharUpper, converter.pascalToCamel);
			break;

		case convention === 'cC' && to === 'PC':
			output = conventionize(data, tests.isFirstCharLower, converter.camelToPascal);
			break;

		case convention === '_' && to === 'PC':
			output = conventionize(data, tests.hasUnderscore, converter.underToPascal);
			break;

		case convention === 'PC' && to === '_':
			output = conventionize(data, tests.isFirstCharUpper, converter.pascalToUnder);
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
	 * @param val - {String}
	 * @param i - {Number}
	 * @return {String} - string with camelCase convention.
	 */
	camelMap: (val, i) => i > 0 ? val.replace(/(^|\s)[a-z]/g, utility.firstCharUpper) : val.toLowerCase(),

	/**
	 * Returns first character of each string in uppercase.
	 *
	 * @param str - {String}
	 * @return {String} - String with first character capitalized.
	 */
	pascalMap: str => utility.firstCharUpper(str),


	/**
	 * Return underscore prop name.
	 *
	 * @param val - {String} - current iteration value.
	 * @param i - {Number} - iteration
	 * @param arr - {Array} - value of array passed in.
	 */
	underscoreMap: (val, i, arr) => i === arr.length - 1
		? val.toLowerCase()
		: val.toLowerCase() + '_',

	/**
	 * Returns the string with the first character uppercase.
	 * @param str - {String}
	 * @return {String} - string with first character uppercase.
	 */
	firstCharLower: str => str.charAt(0).toLowerCase() + str.slice(1),

	/**
	 * Returns the string with the first character uppercase.
	 * @param str - {String}
	 * @return {String} - string with first character uppercase.
	 */
	firstCharUpper: str => str.charAt(0).toUpperCase() + str.slice(1),

	/**
	 * Returns array of strings split at each upper case character.
	 *
	 * @param str - {String}
	 * @return {Array} - comma separated strings.
	 */
	upperCharsSplit: str => str.split(/(?=[A-Z])/),


	/**
	 * Returns Array of strings split at each underscore.
	 * @param str - {String}
	 * @return {Array} - comma separated strings
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
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test.
	 */
	isFirstCharLower: str => str[0] === str[0].toLowerCase(),

	/**
	 * Checks If first character is uppercase.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test.
	 */
	isFirstCharUpper: str => str[0] === str[0].toUpperCase(),

	/**
	 * Checks if any split strings first character is lowercase.
	 *
	 * @param arr - Array of strings.
	 * @return {Boolean} - value if found any first characters lower case.
	 */
	hasLowerCases: arr => arr.filter(tests.isFirstCharLower).length !== 0,

	/**
	 * Checks if str has uppercase characters.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test.
	 */
	hasUpperCase: str => (/[A-Z]/.test(str)),

	/**
	 * Checks if string has at least one underscore.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test
	 */
	hasUnderscore: str => str.includes('_'),
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
	 * @param str - {String}
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
	 * Returns PascalCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - Pascal convention string.
	 */
	underToPascal: str => utility.underscoreSplit(str).map(utility.pascalMap).join(''),

	/**
	 * Returns underscore prop name.
	 *
	 * @param str - {String}
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
	 * Returns PascalCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - PascalCase string.
	 */
	camelToPascal: str => utility.firstCharUpper(str),

	/**
	 * Returns camelCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - First character lowercase.
	 */
	pascalToCamel: str => utility.firstCharLower(str),

	/**
	 * Returns underscore prop name.
	 *
	 * @param str - {String}
	 * @return {String} - underscore string.
	 */
	pascalToUnder: str => utility.upperCharsSplit(str).map(utility.underscoreMap).join(''),
};


module.exports = conventioner;