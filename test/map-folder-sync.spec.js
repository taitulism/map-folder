/* eslint-disable max-lines-per-function */

const {unlink, writeFile} = require('fs');
const {expect} = require('chai');

const mapFolder = require('../index');
const getExpectedResultFor = require('./expected-results/get-expected-result');
const getTestFolderPath = require('./expected-results/get-test-folder-path');

const NOT_FOUND = -1;

describe('map-folder-sync', () => {
	const gitkeepPath = getTestFolderPath('/notes/empty/.gitkeep');

	before((done) => {
		unlink(gitkeepPath, (err) => {
			if (err && !err.message.includes('ENOENT: no such file or directory')) throw err;
			done();
		});
	});

	after((done) => {
		writeFile(gitkeepPath, '', (err) => {
			if (err) throw err;
			done();
		});
	});

	it('exports entery type constants', () => {
		expect(mapFolder.FOLDER).to.equal(0);
		expect(mapFolder.FILE).to.equal(1);
	});

	describe('sync', () => {
		it('can map a single file', () => {
			let res;

			try {
				res = mapFolder.sync(getTestFolderPath('article.doc'));
			}
			catch (ex) {
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(getExpectedResultFor('file'));
		});

		it('map files in folder', () => {
			let res;

			try {
				res = mapFolder.sync(getTestFolderPath('diary'));
			}
			catch (ex) {
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(getExpectedResultFor('folderWithFiles'));
		});

		it('maps a given folder recursively', () => {
			let res;

			try {
				res = mapFolder.sync(getTestFolderPath('/'));
			}
			catch (ex) {
				console.log(ex);
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(getExpectedResultFor('fullStructure'));
		});

		describe('ignore', () => {
			it('ignores a given item', () => {
				let res;

				try {
					res = mapFolder.sync(getTestFolderPath('/'), 'wish-list.txt');
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				expect(res).to.deep.equal(getExpectedResultFor('ignoreItem'));
			});

			it('ignores given list of items', () => {
				let res;

				try {
					res = mapFolder.sync(getTestFolderPath('/'), ['personal', 'day-2.txt']);
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				expect(res).to.deep.equal(getExpectedResultFor('ignoreList'));
			});

			describe('ignore function', () => {
				it('works as a predicate function', () => {
					let res;

					try {
						const filter = ({name}) => !name.includes('h');

						res = mapFolder.sync(getTestFolderPath('/'), filter);
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('filter'));
				});

				it('accepts `pathObj` argument', () => {
					const expected = [
						'dummy-folder',
						'article.doc',
						'notes',
						'wish-list.txt',
						'empty',
						'personal',
						'contacts.csv',
						'goals.txt',
						'diary',
						'day-1.txt',
						'day-2.txt',
						'code',
						'app.js',
						'app.min.js',
						'index.html',
						'style.css',
						'images',
						'logo.png',
						'photo.jpg',
					];

					let i = 0;

					const filter = ({name, path, type}) => {
						expect(expected.indexOf(name)).to.be.above(NOT_FOUND);
						expect(path).to.be.a('string');
						expect(type).to.be.oneOf([0, 1]);
						i++;

						return true;
					};

					mapFolder.sync(getTestFolderPath('/'), filter);

					return expect(i).to.equal(expected.length);
				});
			});
		});

		it('throws when given path does not exist', () => {
			try {
				mapFolder.sync('./test/not/exist');
			}
			catch (err) {
				expect(err.message).to.include('ENOENT: no such file or directory');
			}
		});
	});
});
