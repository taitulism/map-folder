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

	it('throws when `exclude` option is not an array', () => {
		try {
			mapFolderSync('./', {
				exclude: () => null,
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `exclude` option must be an array.');
		}

		return expect(false).to.be.true;
	});

	it('throws when `exclude` option is not an array of strings', () => {
		try {
			mapFolderSync('./', {
				exclude: [null],
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `exclude` array should be an array of strings only.');
		}

		return expect(false).to.be.true;
	});

	it('throws when `include` option is not an array', () => {
		try {
			mapFolderSync('./', {
				include: () => null,
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `include` option must be an array.');
		}

		return expect(false).to.be.true;
	});

	it('throws when `include` option is not an array of strings or objects with a `name` prop', () => {
		try {
			mapFolderSync('./', {
				include: [null],
			});
		}
		catch (ex) {
			return expect(ex.message).to.contain('map-folder: `include` option must be an array of strings or objects. Objects must have a `name` property');
		}

		return expect(false).to.be.true;
	});
};
