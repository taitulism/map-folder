const getEntryType = require('./get-entry-type');
const getOctalMode = require('./get-octal-mode');

/*
  │ Circular Dependency Issue:
  │ *mapFolder* requires forEachEntry
  │ forEachEntry requires handleEntryStat
  │ handleEntryStat requires *mapFolder*
*/
let mapFolder;

const {FILE, FOLDER} = require('./constants');

module.exports = function handleEntryStat (folderMapObj, entryTempObj, done) {
	const {
		fileName,
		name,
		path,
		ext,
		stat,
	} = entryTempObj;

	const type = getEntryType(stat);

	if (type === FILE) {
		folderMapObj.entries[fileName] = {
			name,
			path,
			ext,
			type: FILE,
			mode: getOctalMode(stat.mode),
		};

		done(null, folderMapObj);
	}
	else if (type === FOLDER) {
		// circular dependency fix:
		mapFolder = mapFolder || require('./map-folder');

		mapFolder(path, (mapErr, result) => {
			folderMapObj.entries[name] = result;

			done(null, folderMapObj);
		});
	}
};
