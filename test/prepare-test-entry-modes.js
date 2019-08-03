const {chmod} = require('fs');
const {resolve: resolvePath} = require('path');

const getDefaultModeByPlatform = require('./get-default-mode-by-platform');
const {FILE, FOLDER, DUMMY_FOLDER} = require('./constants');


module.exports = function prepareTestFileModes () {
	return new Promise((resolve, reject) => {
		const rootFolder = resolvePath(__dirname, DUMMY_FOLDER);
		const rootIndex = resolvePath(__dirname, DUMMY_FOLDER, 'index.js');
		const folderA = resolvePath(__dirname, DUMMY_FOLDER, 'a');
		const folderB = resolvePath(__dirname, DUMMY_FOLDER, 'b');
		const indexA = resolvePath(__dirname, DUMMY_FOLDER, 'a/index.js');
		const indexB = resolvePath(__dirname, DUMMY_FOLDER, 'b/index.js');

		const fileMode = getDefaultModeByPlatform(FILE);
		const folderMode = getDefaultModeByPlatform(FOLDER);

		let count = 6;

		chmod(rootFolder, folderMode, (err) => {
			if (err) return reject(err);
			if (--count <= 0) resolve();
		});

		chmod(rootIndex, fileMode, (err) => {
			if (err) return reject(err);
			if (--count <= 0) resolve();
		});

		chmod(folderA, folderMode, (err) => {
			if (err) return reject(err);
			if (--count <= 0) resolve();
		});

		chmod(folderB, folderMode, (err) => {
			if (err) return reject(err);
			if (--count <= 0) resolve();
		});

		chmod(indexA, fileMode, (err) => {
			if (err) return reject(err);
			if (--count <= 0) resolve();
		});

		chmod(indexB, fileMode, (err) => {
			if (err) return reject(err);
			if (--count <= 0) resolve();
		});
	});
};
