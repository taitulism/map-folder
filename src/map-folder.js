const getEntries = require('./read-dir');
const logErr = require('./log-error');
const handleEntries = require('./handle-entries');
const {FOLDER} = require('./constants');

async function mapFolder (folderPath) {
	const folderMap = {
		path: folderPath,
		type: FOLDER,
		entries: {},
	};

	let entries;

	try {
		entries = await getEntries(folderPath);
	}
	catch (ex) {
		logErr('mapFolder ERROR while reading directory:', folderPath);
		throw ex;
	}

	try {
		await handleEntries(folderMap, entries);
	}
	catch (ex) {
		logErr('mapFolder ERROR while handling entries:', folderPath);
		throw ex;
	}

	return folderMap;
}

module.exports = mapFolder;
