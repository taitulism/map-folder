const fs = require('fs');
const $path = require('path');

const createDone = require('./create-done');
const forEachEntry = require('./for-each-entry');
const {FOLDER} = require('./constants');

const joinPath = $path.join;
const resolvePath = $path.resolve;
const fsReadDir = fs.readdir;

function mapFolder (folderPath, endCallBack) {
	const folderMapObj = {
		path: resolvePath(folderPath),
		type: FOLDER,
		entries: {},
	};

	fsReadDir(folderPath, (entryErr, entries) => {
		if (entryErr) {
			throw entryErr;
		}

		const entriesLen = entries.length;

		if (entriesLen === 0) {
			return endCallBack(null, folderMapObj);
		}

		const done = createDone(folderMapObj, entriesLen, endCallBack);

		entries.forEach((fileName) => {
			const entryTempObj = {
				fileName,
				path: joinPath(folderMapObj.path, fileName),
			};

			forEachEntry(folderMapObj, entryTempObj, done);
		});
	});
}

module.exports = mapFolder;
