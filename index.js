'use strict';

/**
 * A Helper function for converting data from and to language conventions with ease.
 *
 * @param data - Single level Object
 * @returns {Object} - Single level Object to language convention.
 */
const conventioner = data => toConvention(fromConvention(data));

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
				convention = 'underscore';
				break;

			case hasUpperCase(key):
				convention = 'camelCase';
				break;

		}
	}
	return [convention, data];
};

/**
 *
 * @param from - Array of results from convention.
 * @returns {Object} - Value of to convention.
 */
function toConvention(from) {
	let [convention, data] = from;
	let output = {};
	/** Format data based on convention */
	switch (convention !== null) {

		case convention === 'underscore':
			output = conventionize(data, hasUnderscore, underToCamel);
			break;

		case convention === 'camelCase':
			output = conventionize(data, hasUpperCase, camelToUnder);
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
 *  Convention Converter methods.
 * ============================================================================
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
 * Returns camel case prop name
 *
 * @param val - string prop name.
 * @param indx - iteration number.
 */
const camelMap = (val, indx) => indx > 0 ? val.replace(/(^|\s)[a-z]/g, char => char.toUpperCase()) : val;

/**
 * Takes camelCase prop name and converts it to underscore prop name.
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

module.exports = conventioner;