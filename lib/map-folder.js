const fs	= require('fs');
const $path = require('path');

const createDone   = require('./create-done');
const getOctalMode = require('./get-octal-mode');
const forEachEntry = require('./for-each-entry');

const {FOLDER} = require('./constants');

const joinPath = $path.join;
const resolvePath = $path.resolve;

const fsStat	= fs.stat;
const fsReadDir = fs.readdir;

function mapFolder (folderPath, endCallBack) {
	const folderMapObj = {
		path: resolvePath(folderPath),
		type: FOLDER,
		len: 0,
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

		folderMapObj.len = entriesLen;

		const folderStatDone = 1;
		const maxCount = entriesLen + folderStatDone;
		const done = createDone(folderMapObj, maxCount, endCallBack);

		fsStat(folderPath, (folderStatErr, folderStat) => {
			if (folderStatErr) {
				return done(folderStatErr, null);
			}

			folderMapObj.mode = getOctalMode(folderStat.mode);

			done(null, null);
		});

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
