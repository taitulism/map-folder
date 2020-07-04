/* eslint-disable max-lines-per-function */

const {unlink, writeFile} = require('fs');
const {expect} = require('chai');

const mapFolder = require('../');
const getTestFolderPath = require('./expected-results/get-test-folder-path');

describe('map-folder', () => {
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

	it('exports sync & async functions', () => {
		expect(mapFolder).to.be.a('function');
		expect(mapFolder.mapFolder).to.be.a('function');
		expect(mapFolder.mapFolderSync).to.be.a('function');
	});

	it('exports entry type constants', () => {
		expect(mapFolder.FOLDER).to.equal(0);
		expect(mapFolder.FILE).to.equal(1);
	});

	describe('mapFolder', require('./test-map-folder-async'));
	describe('mapFolderSync', require('./test-map-folder-sync'));
	describe('Errors', require('./test-map-folder-errors'));
});
