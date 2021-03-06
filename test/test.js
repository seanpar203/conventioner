/**
 * Created by sean on 31/10/2016.
 */
'use strict';
import 'babel-polyfill';

// Testing Deps.
const chai = require('chai');

// Chai Sugar reassignments.
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should;


// Library
const conventioner = require('./../index');


describe('conventioner tests', () => {

	describe('underscores', () => {

		it('should convert underscores to camelCase', () => {
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

		});

		it('should convert underscores to PascalCase', () => {
			const input = {
				blog_date:      'june 24, 1999',
				blog_name:      'Some blog name',
				blog_tags:      ['Test', '1', true, false],
				blog_body:      'lorem ipsum would go here.',
				blog_likes:     15,
				blog_poster:    'Some user here',
				blog_followers: ['Peter', 'John', 'Doe'],
			};
			const expected = {
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogTags:      ['Test', '1', true, false],
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogPoster:    'Some user here',
				BlogFollowers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input, 'PC');

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});
	});


	describe('camelCase', () => {
		it('should convert camelCase to underscores', () => {
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
		});

		it('should convert camelCase to PascalCase', () => {
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
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogTags:      ['Test', '1', true, false],
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogPoster:    'Some user here',
				BlogFollowers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input, 'PC');

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});
	});


	describe('PascalCase', () => {
		it('should convert PascalCase to camelCase ', () => {
			const input = {
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogTags:      ['Test', '1', true, false],
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogPoster:    'Some user here',
				BlogFollowers: ['Peter', 'John', 'Doe'],
			};
			const expected = {
				blogDate:      'june 24, 1999',
				blogName:      'Some blog name',
				blogTags:      ['Test', '1', true, false],
				blogBody:      'lorem ipsum would go here.',
				blogLikes:     15,
				blogPoster:    'Some user here',
				blogFollowers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input);

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});

		it('should convert PascalCase to underscores', () => {
			const input = {
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogTags:      ['Test', '1', true, false],
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogPoster:    'Some user here',
				BlogFollowers: ['Peter', 'John', 'Doe'],
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

			const output = conventioner(input, '_');

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		})
	});

	describe('Converting Multi-level Objects', () => {
		it('should convert all PascalCase property names to camelCase.', () => {
			const input = {
				BlogTags:      [
					{
						SomeTag: 'someTag'
					},
					{
						AnotherTag: true
					}
				],
				BlogPoster:    {
					PosterName: 'Sean',
					PosterAge:  25
				},
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogFollowers: ['Peter', 'John', 'Doe'],
			};
			const expected = {
				blogTags:      [
					{
						someTag: 'someTag'
					},
					{
						anotherTag: true
					}
				],
				blogPoster:    {
					posterName: 'Sean',
					posterAge:  25
				},
				blogDate:      'june 24, 1999',
				blogName:      'Some blog name',
				blogBody:      'lorem ipsum would go here.',
				blogLikes:     15,
				blogFollowers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input);

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});

		it('should convert all camelCase property names to underscores.', () => {
			const input = {
				blogTags:      [
					{
						SomeTag: 'someTag'
					},
					{
						AnotherTag: true
					}
				],
				blogPoster:    {
					posterName: 'Sean',
					posterAge:  25
				},
				blogDate:      'june 24, 1999',
				blogName:      'Some blog name',
				blogBody:      'lorem ipsum would go here.',
				blogLikes:     15,
				blogFollowers: ['Peter', 'John', 'Doe'],
			};
			const expected = {
				blog_tags:      [
					{
						some_tag: 'someTag'
					},
					{
						another_tag: true
					}
				],
				blog_poster:    {
					poster_name: 'Sean',
					poster_age:  25
				},
				blog_date:      'june 24, 1999',
				blog_name:      'Some blog name',
				blog_body:      'lorem ipsum would go here.',
				blog_likes:     15,
				blog_followers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input);

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});

		it('should convert all underscores property names to PascalCase.', () => {
			const input = {
				blog_tags:      [
					{
						some_tag: 'someTag'
					},
					{
						another_tag: true
					}
				],
				blog_poster:    {
					poster_name: 'Sean',
					poster_age:  25
				},
				blog_date:      'june 24, 1999',
				blog_name:      'Some blog name',
				blog_body:      'lorem ipsum would go here.',
				blog_likes:     15,
				blog_followers: ['Peter', 'John', 'Doe'],
			};
			const expected = {
				BlogTags:      [
					{
						SomeTag: 'someTag'
					},
					{
						AnotherTag: true
					}
				],
				BlogPoster:    {
					PosterName: 'Sean',
					PosterAge:  25
				},
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogFollowers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input, 'PC');

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});

		it('should convert all PascalCase property names to underscores.', () => {
			const input = {
				BlogTags:      [
					{
						SomeTag: 'someTag'
					},
					{
						AnotherTag: true
					}
				],
				BlogPoster:    {
					PosterName: 'Sean',
					PosterAge:  25
				},
				BlogDate:      'june 24, 1999',
				BlogName:      'Some blog name',
				BlogBody:      'lorem ipsum would go here.',
				BlogLikes:     15,
				BlogFollowers: ['Peter', 'John', 'Doe'],
			};

			const expected = {
				blog_tags:      [
					{
						some_tag: 'someTag'
					},
					{
						another_tag: true
					}
				],
				blog_poster:    {
					poster_name: 'Sean',
					poster_age:  25
				},
				blog_date:      'june 24, 1999',
				blog_name:      'Some blog name',
				blog_body:      'lorem ipsum would go here.',
				blog_likes:     15,
				blog_followers: ['Peter', 'John', 'Doe'],
			};

			const output = conventioner(input, '_');

			/** Asserts */
			expect(output).to.be.an('object');
			assert.deepEqual(output, expected);
		});
	});
});