/* eslint-disable max-lines-per-function */

const {expect} = require('chai');

const {mapFolderSync} = require('..');
const getExpectedResultFor = require('./expected-results/get-expected-result');
const getTestFolderPath = require('./expected-results/get-test-folder-path');

module.exports = () => {
	describe('arg[0] - path', () => {
		it('can map a single file', () => {
			let res;

			try {
				res = mapFolderSync(getTestFolderPath('article.doc'));
			}
			catch (ex) {
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(getExpectedResultFor('file'));
		});

		it('maps files in folder', () => {
			let res;

			try {
				res = mapFolderSync(getTestFolderPath('diary'));
			}
			catch (ex) {
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(getExpectedResultFor('folderWithFiles'));
		});

		it('maps a given folder recursively', () => {
			let res;

			try {
				res = mapFolderSync(getTestFolderPath('/'));
			}
			catch (ex) {
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(getExpectedResultFor('fullStructure'));
		});
	});

	describe('arg[1]', () => {
		describe('exclude', () => {
			it('skips a given item', () => {
				let res;

				try {
					res = mapFolderSync(getTestFolderPath('/'), 'wish-list.txt');
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				expect(res).to.deep.equal(getExpectedResultFor('excludeFile'));
			});

			it('skips given list of items', () => {
				let res;

				try {
					res = mapFolderSync(getTestFolderPath('/'), ['personal', 'day-2.txt']);
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				expect(res).to.deep.equal(getExpectedResultFor('excludeEntryNames'));
			});
		});

		describe('filter', () => {
			it('works as a predicate function', () => {
				let res;

				try {
					const filter = ({name}) => !name.includes('h');

					res = mapFolderSync(getTestFolderPath('/'), filter);
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
					'FLAG',
					'.dotfile',
					'images',
					'logo.png',
					'photo.jpg',
				];

				let i = 0;

				const NOT_FOUND = -1;
				const filter = ({name, path, type}) => {
					expect(expected.indexOf(name)).to.be.above(NOT_FOUND);
					expect(path).to.be.a('string');
					expect(type).to.be.oneOf([0, 1]);
					i++;

					return true;
				};

				mapFolderSync(getTestFolderPath('/'), filter);

				return expect(i).to.equal(expected.length);
			});
		});

		describe('options', () => {
			describe('filter', () => {
				it('works as a predicate function', () => {
					let res;

					try {
						const filter = ({name}) => !name.includes('h');

						res = mapFolderSync(getTestFolderPath('/'), {filter});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('filter'));
				});

				it('is called after `include`/`exclude`', () => {
					let resA, resB;
					let callsCountA = 0;
					let callsCountB = 0;

					try {
						resA = mapFolderSync(getTestFolderPath('/'), {
							filter: ({name}) => {
								callsCountA++;
								return !name.includes('h')
							},
						});

						resB = mapFolderSync(getTestFolderPath('/'), {
							exclude: 'index.html',
							filter: ({name}) => {
								callsCountB++;
								return !name.includes('h')
							},
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					const sameResult = getExpectedResultFor('filterAfter');

					expect(resA).to.deep.equal(sameResult);
					expect(resB).to.deep.equal(sameResult);

					// second filter is called 1 time less because of the `exclude`
					expect(callsCountA - callsCountB).to.equal(1);
				});
			});

			describe('exclude', () => {
				it('skips given list of entry names', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							exclude: ['personal', 'day-2.txt'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('excludeEntryNames'));
				});

				it('skips given list of file extensions', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							exclude: ['.csv', '.doc']
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('excludeExtensions'));
				});
			});

			describe('include', () => {
				it('only maps given file extensions', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							include: ['.csv', '.doc'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('includeExtensions'));
				});

				it('only maps given files', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							include: ['day-2.txt', 'app.min.js'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('includeFiles'));
				});

				it('only maps given file extensions and specific files', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							include: ['.csv', '.doc', 'day-2.txt'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('includeExtensionsAndFiles'));
				});

				it('only maps given file extensions and everything in given folders', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							include: ['.txt', 'code'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('extensionsAndWholeFolder'));
				});
			});

			describe('skipEmpty', () => {
				it('toggle skip empty folders when using `include`', () => {
					let res;

					try {
						res = mapFolderSync(getTestFolderPath('/'), {
							include: ['.csv', '.doc'],
							skipEmpty: false,
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('skipEmpty'));
				});
			});
		});
	});


	it('throws when given path does not exist', () => {
		try {
			mapFolderSync('./test/not/exist');
		}
		catch (err) {
			expect(err.message).to.include('ENOENT: no such file or directory');
		}
	});
};
