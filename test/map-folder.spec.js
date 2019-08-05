/* eslint-disable max-lines-per-function */
const {expect} = require('chai');

const expectedResult = require('./expected-result');
const {DUMMY_FOLDER} = require('./constants');

const mapFolder = require('../index');

describe('mapFolder', () => {
	it('is a function', () => {
		expect(mapFolder).to.be.a('function');
	});

	it('maps a given folder to a JSON', (done) => {
		mapFolder(`./test/${DUMMY_FOLDER}`, (err, result) => {
			if (err) throw err;

			expect(result).to.deep.equal(expectedResult);
			done();
		});
	});
});
