/**
 * Created by sean on 09/01/2017.
 */
'use strict';
require('babel-polyfill');

const Conventioner = require('./../index');


const TEST_DATA = {
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
const conv = new Conventioner();

console.time('Using delete object');
console.log(conv.to_(TEST_DATA));
console.timeEnd('Using delete object');
