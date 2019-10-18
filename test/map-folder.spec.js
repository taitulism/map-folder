/* eslint-disable max-lines-per-function */

const {unlink, writeFile} = require('fs');
const {resolve} = require('path');
const {expect} = require('chai');

const mapFolder = require('../index');
const expectedResult = require('./expected-result');

const DUMMY_FOLDER = 'dummy-folder';

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

	it('is a function', () => {
		expect(mapFolder).to.be.a('function');
	});

	it('exports entery type constants', () => {
		expect(mapFolder.FOLDER).to.equal(0);
		expect(mapFolder.FILE).to.equal(1);
	});

	it('throws when given path does not exist', () => (
		mapFolder('./test/not/exist')
			.then(() => expect(true).to.be.false)
			.catch(err => expect(err.message).to.include('ENOENT: no such file or directory'))
	));

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
});
