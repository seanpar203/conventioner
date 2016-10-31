/**
 * Created by sean on 31/10/2016.
 */
'use strict';

// Testing Deps.
const chai = require('chai');

// Chai Sugar reassignments.
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;


// Library
const conventioner = require('./../index');


describe('conventioner tests', () => {

	describe('underscore to camelCase', () => {
		it('should convert prop names to camel case.', () => {
			const input = {
				user_id:       1,
				user_name:     'Some user',
				user_email:    'some@gmail.com',
				user_birthday: 'may 3rd, 1991',
				user_address:  '42 holley drive',
			};
			const expected = {
				userId:       1,
				userName:     'Some user',
				userBirthday: 'may 3rd, 1991',
				userEmail:    'some@gmail.com',
				userAddress:  '42 holley drive',
			};

			const output = conventioner(input);

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);

		})
	});

	describe('camelCase to underscore', () => {
		it('should convert prop names to underscore', () => {
			const input = {
				blogDate:      'june 24, 1999',
				blogName:      'Some blog name',
				blogTags:      ['Test', '1', true, false],
				blogBody:      'lorem ipsum would go here.',
				blogLikes:     15,
				blogPoster:    'Some user here',
				blogFollowers: ['Peter', 'John', 'Doe'],
			};

			const expected = {
				blog_date:      'june 24, 1999',
				blog_name:      'Some blog name',
				blog_tags:      ['Test', '1', true, false],
				blog_body:      'lorem ipsum would go here.',
				blog_likes:     15,
				blog_poster:    'Some user here',
				blog_followers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input);

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		})
	});
});