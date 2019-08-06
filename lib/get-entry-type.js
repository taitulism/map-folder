const getStat = require('./get-stat');
const logErr = require('./log-error');
const {
	FILE,
	FOLDER,
} = require('./constants');

module.exports = async function getEntryType (entryPath) {
	let statObj;

	try {
		statObj = await getStat(entryPath);
	}
	catch (ex) {
		logErr('mapFolder ERROR while getting stat for file:', entryPath);
		throw ex;
	}

	const isFolder = statObj.isDirectory();

	if (isFolder) {
		return FOLDER;
	}

	return FILE;

	// TODO: Support symlinks (fs.lstat)
};
