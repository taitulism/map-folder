const getEntries = require('./read-dir');
const handleEntries = require('./handle-entries');
const {FOLDER} = require('./constants');

async function mapFolder (folderPath) {
	const folderMap = {
		path: folderPath,
		type: FOLDER,
		entries: {},
	};

	const entries = await getEntries(folderPath);

	await handleEntries(folderMap, entries);

	return folderMap;
}

module.exports = mapFolder;
