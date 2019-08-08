/* eslint-disable max-lines-per-function */
const {expect} = require('chai');

const expectedResult = require('./expected-result');
const {DUMMY_FOLDER} = require('./constants');

const mapFolder = require('../index');

describe('mapFolder', () => {
	it('is a function', () => {
		expect(mapFolder).to.be.a('function');
	});

	it('maps a given folder to a JSON', async () => {
		let res;

		try {
			res = await mapFolder(`./test/${DUMMY_FOLDER}`);
		}
		catch (ex) {
			/* eslint-disable-next-line no-console */
			console.error(ex);

			return expect(false).to.be.true;
		}

		return expect(res).to.deep.equal(expectedResult);
	});
});
