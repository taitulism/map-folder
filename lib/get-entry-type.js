const getStat = require('./get-stat');
const {
	FILE,
	FOLDER,
} = require('./constants');

module.exports = async function getEntryType (entryPath) {
	const statObj = await getStat(entryPath);
	const isFolder = statObj.isDirectory();

	if (isFolder) {
		return FOLDER;
	}

	return FILE;

	// TODO: Support symlinks (fs.lstat)
};
