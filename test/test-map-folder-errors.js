/* eslint-disable max-lines-per-function */
const {expect} = require('chai');

const {mapFolderSync} = require('..');
const getExpectedResultFor = require('./expected-results/get-expected-result');
const getTestFolderPath = require('./expected-results/get-test-folder-path');

module.exports = () => {
	// it('throws when both `includeExt` & `excludeExt` are used', () => {
	// 	try {
	// 		mapFolderSync('./', {
	// 			includeExt: ['js'],
	// 			excludeExt: ['js'],
	// 		});
	// 	}
	// 	catch (ex) {
	// 		return expect(ex.message).to.contain('`includeExt` OR `excludeExt` but not both');
	// 	}

	// 	return expect(false).to.be.true;
	// });

	it('throws when filter is not a function', () => {
		try {
			mapFolderSync('./', {
				filter: 'not a function',
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('`filter` must be a function');
		}

		return expect(false).to.be.true;
	});

	it('throws when exclude is not a string nor an array', () => {
		try {
			mapFolderSync('./', {
				exclude: () => {},
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('`exclude` must be either a string or an array');
		}

		return expect(false).to.be.true;
	});

	it('throws when include is not a string nor an array', () => {
		try {
			mapFolderSync('./', {
				include: () => {},
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('`include` must be either a string or an array');
		}

		return expect(false).to.be.true;
	});
};
