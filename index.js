'use strict';

const _isArray = require('lodash/fp/isArray');
const _isObject = require('lodash/fp/isObject');


class Conventioner {

	constructor() {
		this._data = {};
		this._convention = null;

		// Create Helper classes.
		this._tests = new Tests();
		this._converters = new Converters();
	}

	// ============================================================
	// Public Methods.
	//=============================================================
	to_(data) {
		this._initialSteps(data);
		return this._findAndConvertTo('_');
	}

	/**
	 * Finds the convention and returns a string of convention.
	 * @return {String} - Convention.
	 */
	findConvention() {
		this._resetConvention();
		this._recursiveFind(this._data);
		return this._convention;
	}

	// ============================================================
	// Private Methods.
	//=============================================================

	_initialSteps(data) {
		this._data = data;
		this._resetConvention();
		this._recursiveFind(data);
	}

	_resetConvention() {
		this._convention = null;
	}

	/**
	 * Decides what tests and convention to use for converting properties.
	 * Then returns the converted data.
	 *
	 * @param to - {String} - Optional value to force certain convention.
	 * @returns {Object} - Value of to convention.
	 */
	_findAndConvertTo(to) {

		let test;
		let converter;
		const convention = this._convention;

		switch (true) {

			case convention === 'cC' && to === 'PC':
				test = this._tests.isFirstCharLower;
				converter = this._converters.camelToPascal;
				break;

			case convention === '_' && to === 'PC':
				test = this._tests.hasUnderscore;
				converter = this._converters.underToPascal;
				break;

			case convention === 'PC' && to === '_':
				test = this._tests.isFirstCharUpper;
				converter = this._converters.pascalToUnder;
				break;

			// If no conventions found.
			default:
				return this._data;
		}

		return this._convertProps(this._data, test, converter);
	}

	/**
	 * Analyze all property names in attempts to find a language convention.
	 *
	 * @param data - {*}
	 */
	_recursiveFind(data) {

		if (this._convention.length > 0) {
			return;
		}

		else if (_isArray(data)) {
			for (let i = 0; i < data.length; ++i) {
				this._recursiveFind(data[i])
			}
		}

		else if (_isObject(data)) {
			let dataLength = Object.keys(data).length;

			for (let i = 0; i < dataLength; i += 1) {
				let key = Object.keys(data)[i];
				let val = data[key];

				switch (key !== null) {

					case this._tests.hasUnderscore(key):
						this._convention = '_';
						break;

					case this._tests.isFirstCharLower(key) && this._tests.hasUpperCase(key):
						this._convention = 'cC';
						break;

					case this._tests.isFirstCharUpper(key):
						this._convention = 'PC';
						break
				}

				if (_isObject(val) || _isArray(val)) {
					this._recursiveFind(val);
				}
			}
		}
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


module.exports = Conventioner;