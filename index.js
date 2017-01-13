'use strict';

const _isArray = require('lodash/fp/isArray');
const _isObject = require('lodash/fp/isObject');

/**
 * A Helper function for converting data from and to language conventions with ease.
 *
 * @param data - {Object} - Single level Object
 * @param to - {String} - Optional value to force specific convention.
 * @returns {Object} - Single level Object to language convention.
 */
const conventioner = (data, to = null) => toConvention(fromConvention(data), to);


/**
 * Decides what convention to change to.
 *
 * @param from - {Array} - results fromConvention method.
 * @param to - {String} - Optional value to force certain convention.
 * @returns {Object} - Value of to convention.
 */
function toConvention(from, to) {
	let [convention, data] = from;
	let output;

	switch (convention !== null) {

		// When to param is null.
		case convention === '_' && to === null:
			output = conventionize(data, tests.hasUnderscore, converter.underToCamel);
			break;

		case convention === 'cC' && to === null:
			output = conventionize(data, tests.hasUpperCase, converter.camelToUnder);
			break;

		case convention === 'PC' && to === null:
			output = conventionize(data, tests.isFirstCharUpper, converter.pascalToCamel);
			break;

		// When to param isn't null.
		case convention === 'cC' && to === 'PC':
			output = conventionize(data, tests.isFirstCharLower, converter.camelToPascal);
			break;

		case convention === '_' && to === 'PC':
			output = conventionize(data, tests.hasUnderscore, converter.underToPascal);
			break;

		case convention === 'PC' && to === '_':
			output = conventionize(data, tests.isFirstCharUpper, converter.pascalToUnder);
			break;

		// If no conventions found.
		default:
			output = data;
	}

	return output;
}

/**
 * Finds convention by analyzing data props.
 *
 * @param data - object to find convention.
 * @returns {Array} - name of convention
 */
const fromConvention = (data) => [utility.findConvention(data), data];

/**
 * Generic method that converts object prop names.
 *
 * @param data - {Object} - data to change conventions.
 * @param test - {Function} - test case to check if matches convention.
 * @param converter - {Function} - method to convert prop name to desired.
 * @return {Object} - Value of converted conventions.
 */
const conventionize = (data, test, converter) => utility.convertProps(data, test, converter);

class Conventioner {

	constructor() {
		this.convention = '';

		// Create Helper classes.
		this.tests = new Tests();
		this.converters = new Converters();
	}

	// ============================================================
	// Private Methods.
	//=============================================================

	/**
	 * Recursively find the convention by looking through every object
	 * until one is found. In the event that a convention isn't found
	 * the method will just return a empty string.
	 *
	 * @param data - {Array, Object}
	 * @return {String} - Convention.
	 */
	_findConvention(data) {
		let convention = '';

		/**
		 * Analyze all property names in attempts to find a language convention.
		 *
		 * @param data - {*}
		 */
		function recursiveFind(data) {

			if (convention.length > 0) {
				return;
			}

			else if (_isArray(data)) {
				for (let i = 0; i < data.length; ++i) {
					recursiveFind(data[i])
				}
			}

			else if (_isObject(data)) {
				let dataLength = Object.keys(data).length;

				for (let i = 0; i < dataLength; i += 1) {
					let key = Object.keys(data)[i];
					let val = data[key];

					switch (key !== null) {

						case this.tests.hasUnderscore(key):
							convention = '_';
							break;

						case this.tests.isFirstCharLower(key) && this.tests.hasUpperCase(key):
							convention = 'cC';
							break;

						case this.tests.isFirstCharUpper(key):
							convention = 'PC';
							break
					}

					if (_isObject(val) || _isArray(val)) {
						recursiveFind(val);
					}
				}
			}
		}

		recursiveFind(data);

		return convention.length > 0 ? convention : null;
	}

	/**
	 * Recursive method to convert multi-level objects to convention.
	 *
	 * @param data - {Array, Object}
	 * @param test - {Function}
	 * @param converter - {Function}
	 * @return {*}
	 */
	_convertProps(data, test, converter) {

		/**
		 * Search all objects changing data properties where test passes.
		 *
		 * @param data - {*}
		 */
		function recursiveConverter(data) {

			if (_isArray(data)) {
				for (let i = 0; i < data.length; i += 1) {
					recursiveConverter(data[i])
				}
			}

			else if (_isObject(data)) {
				let dataLength = Object.keys(data).length;

				for (let i = dataLength; i > 0; i -= 1) {
					let key = Object.keys(data)[i - 1];
					let val = data[key];

					if (test(key)) {
						delete data[key];
						key = converter(key);
						data[key] = val;
					}

					if (_isObject(val) || _isArray(val)) {
						recursiveConverter(val);
					}
				}
			}
		}

		recursiveConverter(data);

		return data;
	}
}

/**
 * Utility class.
 * =================================================
 *
 * Notes:
 *  Utility methods must return anything but a Boolean.
 *
 */

class Utility {
	/**
	 * Returns camelCase prop name.
	 *
	 * @param val - {String}
	 * @param i - {Number}
	 * @return {String} - string with camelCase convention.
	 */
	camelMap(val, i) {
		return i > 0 ? val.replace(/(^|\s)[a-z]/g, this.firstCharUpper) : val.toLowerCase();
	}

	/**
	 * Returns PascalCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - String with first character capitalized.
	 */
	pascalMap(str) {
		return this.firstCharUpper(str)
	}


	/**
	 * Return underscore prop name.
	 *
	 * @param val - {String} - current iteration value.
	 * @param i - {Number} - iteration
	 * @param arr - {Array} - value of array passed in.
	 */
	underscoreMap(val, i, arr) {
		if (i === arr.length - 1) {
			return val.toLowerCase();
		}
		return val.toLowerCase() + '_';
	}

	/**
	 * Returns the string with the first character uppercase.
	 * @param str - {String}
	 * @return {String} - string with first character uppercase.
	 */
	firstCharLower(str) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	}

	/**
	 * Returns the string with the first character uppercase.
	 * @param str - {String}
	 * @return {String} - string with first character uppercase.
	 */
	firstCharUpper(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	/**
	 * Returns array of strings split at each upper case character.
	 *
	 * @param str - {String}
	 * @return {Array} - comma separated strings.
	 */
	upperCharsSplit(str) {
		return str.split(/(?=[A-Z])/);
	}


	/**
	 * Returns Array of strings split at each underscore.
	 * @param str - {String}
	 * @return {Array} - comma separated strings
	 */
	underscoreSplit(str) {
		return str.split('_');
	}
}

/**
 *  Tests Class.
 * =================================================
 *
 * Notes:
 *  Tests methods must only return a Boolean.
 */

class Tests {

	/**
	 * Checks If first character is lowercase.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test.
	 */
	isFirstCharLower(str) {
		return str[0] === str[0].toLowerCase();
	}

	/**
	 * Checks If first character is uppercase.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test.
	 */
	isFirstCharUpper(str) {
		return str[0] === str[0].toUpperCase();
	}

	/**
	 * Checks if str has uppercase characters.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test.
	 */
	hasUpperCase(str) {
		return (/[A-Z]/.test(str))
	}

	/**
	 * Checks if string has at least one underscore.
	 *
	 * @param str - {String}
	 * @return {Boolean} - Value of test
	 */
	hasUnderscore(str) {
		return str.includes('_');
	}
}

/**
 *  Converters class.
 * =================================================
 *
 * Notes:
 *  Converter methods must manipulate parameter.
 */

class Converters {

	constructor() {
		this.utility = new Utility();
	}

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
	underToCamel(str) {
		return this.utility.underscoreSplit(str).map(this.utility.camelMap).join('');
	}


	/**
	 * Returns PascalCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - Pascal convention string.
	 */
	underToPascal(str) {
		return this.utility.underscoreSplit(str).map(this.utility.pascalMap).join('');
	}

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
	camelToUnder(str) {
		return str.replace(/\.?([A-Z])/g, (x, y) => "_" + y.toLowerCase()).replace(/^_/, "");
	}

	/**
	 * Returns PascalCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - PascalCase string.
	 */
	camelToPascal(str) {
		return this.utility.firstCharUpper(str);
	}

	/**
	 * Returns camelCase prop name.
	 *
	 * @param str - {String}
	 * @return {String} - First character lowercase.
	 */
	pascalToCamel(str) {
		return this.utility.firstCharLower(str);

	}

	/**
	 * Returns underscore prop name.
	 *
	 * @param str - {String}
	 * @return {String} - underscore string.
	 */
	pascalToUnder(str) {
		return this.utility.upperCharsSplit(str).map(this.utility.underscoreMap).join('');
	}
}


module.exports = conventioner;