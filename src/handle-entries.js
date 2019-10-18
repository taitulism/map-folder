const {join} = require('path');

/*
  │ Circular Dependency Issue:
  │ *mapEntry* requires mapFolder
  │ mapFolder requires handle-entries
  │ handle-entries requires *mapEntry*
*/
let mapEntry;

module.exports = async function handleEntries (folderMap, entries) {
	mapEntry = mapEntry || require('./map-entry');

	const promises = entries.map((entryName) => {
		const entryPath = join(folderMap.path, entryName);

		return mapEntry(entryPath).then((entryMap) => {
			folderMap.entries[entryName] = entryMap;
		});
	});

	await Promise.all(promises);
};
