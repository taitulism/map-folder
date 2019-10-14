const {resolve, parse} = require('path');

const mapFolder = require('./map-folder');
const getEntryType = require('./get-entry-type');
const logErr = require('./log-error');
const {FILE, FOLDER} = require('./constants');

module.exports = async function mapEntry (rawEntryPath) {
	const entryPath = resolve(rawEntryPath);
	let entryType;

	try {
		entryType = await getEntryType(entryPath);
	}
	catch (ex) {
		logErr('mapFolder ERROR while getting stat for entry:', entryPath);
		throw ex;
	}

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
		try {
			return await mapFolder(entryPath);
		}
		catch (ex) {
			logErr('mapFolder ERROR while mapping a folder:', entryPath);
			throw ex;
		}
	}
};
