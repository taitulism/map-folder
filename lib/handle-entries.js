const {join} = require('path');

const logErr = require('./log-error');

/*
  │ Circular Dependency Issue:
  │ *mapEntry* requires mapFolder
  │ mapFolder requires handle-entries
  │ handle-entries requires *mapEntry*
*/
let mapEntry;

module.exports = async function handleEntries (folderMap, entries) {
	mapEntry = mapEntry || require('./map-entry');

	try {
		const promises = entries.map((entryName) => {
			const entryPath = join(folderMap.path, entryName);

			return mapEntry(entryPath).then((entryMap) => {
				folderMap.entries[entryName] = entryMap;
			});
		});

		await Promise.all(promises);
	}
	catch (ex) {
		logErr('mapFolder ERROR while mapping entries');
		throw ex;
	}
};
