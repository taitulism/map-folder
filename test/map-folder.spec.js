/* eslint-disable max-lines-per-function */
const {expect} = require('chai');

const prepareTestEntryModes = require('./prepare-test-entry-modes');
const expectedResult = require('./expected-result');
const {DUMMY_FOLDER} = require('./constants');

const mapFolder = require('../index');

describe('mapFolder', () => {
	before((done) => {
		prepareTestEntryModes().then(() => {
			done();
		}, (err) => {
			/* eslint-disable-next-line no-underscore-dangle */
			const _r = '\r';

			/* eslint-disable no-console */
			console.error(`
				${_r}Test preparation Failed (prepareTestEntryModes):
				${_r}------------------------------------------------`);
			console.error(err);
			/* eslint-enable no-console */
		});
	});

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
