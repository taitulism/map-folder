/* eslint-disable max-lines-per-function */

const {unlink, writeFile} = require('fs');
const {resolve} = require('path');
const {expect} = require('chai');

const mapFolder = require('../index');
const getExpectedResult = require('./expected-result');
const expectedResult = getExpectedResult();

const DUMMY_FOLDER = 'dummy-folder';
const NOT_FOUND = -1;

describe('mapFolder', () => {
	const gitkeepPath = resolve('./test/dummy-folder/empty/.gitkeep');

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
		it('is a function', () => {
			expect(mapFolder.sync).to.be.a('function');
		});

		it('maps a given folder to a JSON', () => {
			let res;

			try {
				res = mapFolder.sync(`./test/${DUMMY_FOLDER}`);
			}
			catch (ex) {
				throw expect(false).to.be.true;
			}

			expect(res).to.deep.equal(expectedResult);
		});

		describe('ignore', () => {
			it('ignores a given item', async () => {
				let res;

				try {
					res = await mapFolder(`./test/${DUMMY_FOLDER}`, 'aaa');
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				const expected = getExpectedResult();

				delete expected.entries.aaa;

				return expect(res).to.deep.equal(expected);
			});

			it('ignores given list of items', async () => {
				let res;

				try {
					res = await mapFolder(`./test/${DUMMY_FOLDER}`, ['bbb.min.js', 'empty']);
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				const expected = getExpectedResult();

				delete expected.entries.aaa.entries['bbb.min.js'];
				delete expected.entries.empty;

				return expect(res).to.deep.equal(expected);
			});

			describe('ignore function', () => {
				it('ignores by a function', async () => {
					let res;

					try {
						const ignore = name => name.includes('z');

						res = await mapFolder(`./test/${DUMMY_FOLDER}`, ignore);
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					const expected = getExpectedResult();

					delete expected.entries.foo.entries.bar.entries['baz.js'];

					return expect(res).to.deep.equal(expected);
				});

				it('accepts 3 arguments', async () => {
					const expected = [
						'dummy-folder', // 1
						'aaa',          // 2
						'empty',        // 3
						'foo',          // 4
						'main.html',    // 5
						'bbb.min.js',   // 6
						'bar',          // 7
						'baz.js',       // 8
					];

					let i = 0;

					const ignoreFn = (base) => {
						expect(expected.indexOf(base)).to.be.above(NOT_FOUND);
						i++;
					};

					await mapFolder(`./test/${DUMMY_FOLDER}`, ignoreFn);

					return expect(i).to.equal(expected.length);
				});
			});
		});


		it('can map a file', () => {
			const filePath = `./test/${DUMMY_FOLDER}/main.html`;

			try {
				const res = mapFolder.sync(filePath);

				expect(res).to.deep.equal({
					path: resolve(filePath),
					type: mapFolder.FILE,
					name: 'main',
					ext: 'html',
				});
			}
			catch (err) {
				return expect(false).to.be.true;
			}
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

	describe('async', () => {
		it('is a function', () => {
			expect(mapFolder).to.be.a('function');
		});

		it('maps a given folder to a JSON', async () => {
			let res;

			try {
				res = await mapFolder(`./test/${DUMMY_FOLDER}`);
			}
			catch (ex) {
				return expect(false).to.be.true;
			}

			return expect(res).to.deep.equal(expectedResult);
		});

		describe('ignore', () => {
			it('ignores a given item', () => {
				let res;

				try {
					res = mapFolder.sync(`./test/${DUMMY_FOLDER}`, 'aaa');
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				const expected = getExpectedResult();

				delete expected.entries.aaa;

				expect(res).to.deep.equal(expected);
			});

			it('ignores given list of items', () => {
				let res;

				try {
					res = mapFolder.sync(`./test/${DUMMY_FOLDER}`, ['bbb.min.js', 'empty']);
				}
				catch (ex) {
					return expect(false).to.be.true;
				}

				const expected = getExpectedResult();

				delete expected.entries.aaa.entries['bbb.min.js'];
				delete expected.entries.empty;

				expect(res).to.deep.equal(expected);
			});
			describe('ignore function', () => {
				it('ignores by a function', () => {
					let res;

					try {
						const ignore = name => name.includes('z');

						res = mapFolder.sync(`./test/${DUMMY_FOLDER}`, ignore);
					}
					catch (ex) {
						return expect(false).to.be.true;
					}

					const expected = getExpectedResult();

					delete expected.entries.foo.entries.bar.entries['baz.js'];

					expect(res).to.deep.equal(expected);
				});

				it('accepts 3 arguments', () => {
					const expected = [
						'dummy-folder', // 1
						'aaa',          // 2
						'empty',        // 3
						'foo',          // 4
						'main.html',    // 5
						'bbb.min.js',   // 6
						'bar',          // 7
						'baz.js',       // 8
					];

					let i = 0;

					const ignoreFn = (base) => {
						expect(expected.indexOf(base)).to.be.above(NOT_FOUND);
						i++;
					};

					mapFolder.sync(`./test/${DUMMY_FOLDER}`, ignoreFn);

					return expect(i).to.equal(expected.length);
				});
			});
		});

		it('can map a file', () => {
			const filePath = `./test/${DUMMY_FOLDER}/main.html`;

			return mapFolder(filePath)
				.then(res => expect(res).to.deep.equal({
					path: resolve(filePath),
					type: mapFolder.FILE,
					name: 'main',
					ext: 'html',
				}))
				.catch(() => expect(false).to.be.true);
		});

		it('throws when given path does not exist', () => (
			mapFolder('./test/not/exist')
				.then(() => expect(true).to.be.false)
				.catch(err => expect(err.message).to.include('ENOENT: no such file or directory'))
		));
	});
});
