const {resolve, parse} = require('path');

const mapFolder = require('./map-folder');
const getEntryType = require('./get-entry-type');
const {FILE, FOLDER} = require('./constants');

module.exports = async function mapEntry (rawEntryPath) {
	const entryPath = resolve(rawEntryPath);
	const entryType = await getEntryType(entryPath);

	if (entryType === FILE) {
		const {name, ext} = parse(entryPath);

		return {
			path: entryPath,
			type: FILE,
			name,
			ext: ext.substr(1),
		};
	}
	else if (entryType === FOLDER) {
		return mapFolder(entryPath);
	}
};
