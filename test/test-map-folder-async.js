const {expect} = require('chai');

const mapFolder = require('../index');
const getExpectedResultFor = require('./expected-results/get-expected-result');
const getTestFolderPath = require('./expected-results/get-test-folder-path');

module.exports = () => {
	describe('arg[0] - path', () => {
		it('can map a single file', () => (
			mapFolder(getTestFolderPath('article.doc'))
				.then(res => expect(res).to.deep.equal(getExpectedResultFor('file')))
				.catch(() => expect(false).to.be.true)
		));

		it('maps files in folder', async () => {
			let res;

			try {
				res = await mapFolder(getTestFolderPath('diary'));
			}
			catch (ex) {
				return expect(false).to.be.true;
			}

			return expect(res).to.deep.equal(getExpectedResultFor('folderWithFiles'));
		});

		it('maps a given folder recursively', async () => {
			let res;

			try {
				res = await mapFolder(getTestFolderPath('/'));
			}
			catch (ex) {
				return expect(false).to.be.true;
			}

			return expect(res).to.deep.equal(getExpectedResultFor('fullStructure'));
		});
	});

	describe('arg[1]', () => {
		describe('exclude', () => {
			it('skips given list of items', async () => {
				let res;

				try {
					res = await mapFolder(getTestFolderPath('/'), ['personal', 'day-2.txt']);
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				return expect(res).to.deep.equal(getExpectedResultFor('excludeEntryNames'));
			});
		});

		describe('filter', () => {
			it('works as a predicate function', async () => {
				let res;

				try {
					const filter = ({name}) => !name.includes('h');

					res = await mapFolder(getTestFolderPath('/'), filter);
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				return expect(res).to.deep.equal(getExpectedResultFor('filter'));
			});

			it('accepts `pathObj` argument', async () => {
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
				const filter = ({name, path, isFolder}) => {
					expect(expected.indexOf(name)).to.be.above(NOT_FOUND);
					expect(path).to.be.a('string');
					expect(isFolder).to.be.a('boolean');
					i++;

					return true;
				};

				await mapFolder(getTestFolderPath('/'), filter);

				return expect(i).to.equal(expected.length);
			});
		});

		describe('options', () => {
			describe('filter', () => {
				it('works as a predicate function', async () => {
					let res;

					try {
						const filter = ({name}) => !name.includes('h');

						res = await mapFolder(getTestFolderPath('/'), {filter});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					return expect(res).to.deep.equal(getExpectedResultFor('filter'));
				});

				it('is called after `include`/`exclude`', async () => {
					let resA, resB;
					let callsCountA = 0;
					let callsCountB = 0;

					try {
						resA = await mapFolder(getTestFolderPath('/'), {
							filter: ({name}) => {
								callsCountA++;
								return !name.includes('h');
							},
						});

						resB = await mapFolder(getTestFolderPath('/'), {
							exclude: ['index.html', false],
							filter: ({name}) => {
								callsCountB++;
								return !name.includes('h');
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
				it('skips given list of entry names', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							exclude: ['personal', 'day-2.txt'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('excludeEntryNames'));
				});

				it('skips given list of file extensions', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
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
				it('only maps given file extensions', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							include: ['.csv', '.doc'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('includeExtensions'));
				});

				it('only maps given files', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							include: ['day-2.txt', 'app.min.js'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('includeFiles'));
				});

				it('only maps given file extensions and specific files', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							include: ['.csv', '.doc', 'day-2.txt'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('includeExtensionsAndFiles'));
				});

				it('only maps given file extensions and everything in given folders', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							include: ['.txt', 'code'],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('extensionsAndWholeFolder'));
				});

				it('maps given folders with their own options', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							include: [
								'.txt',
								{
									name: 'code',
									include: ['.js', '.html'],
									exclude: ['app.js'],
								}
							],
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					expect(res).to.deep.equal(getExpectedResultFor('folderWithOptions'));
				});
			});

			describe('skipEmpty', () => {
				it('toggle skip empty folders when using `include`', async () => {
					let res;

					try {
						res = await mapFolder(getTestFolderPath('/'), {
							include: ['.csv', '.doc'],
							skipEmpty: false,
						});
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					return expect(res).to.deep.equal(getExpectedResultFor('skipEmpty'));
				});
			});
		});
	});


	it('throws when given path does not exist', () => (
		mapFolder('./test/not/exist')
			.then(() => expect(true).to.be.false)
			.catch(err => expect(err.message).to.include('ENOENT: no such file or directory'))
	));
};
