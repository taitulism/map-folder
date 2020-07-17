/* eslint-disable max-lines-per-function */
const {expect} = require('chai');

const {mapFolderSync} = require('..');

module.exports = () => {
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
