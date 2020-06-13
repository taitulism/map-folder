const {statSync, readdirSync} = require('fs');
const {resolve, parse, join} = require('path');

const {FILE, FOLDER} = require('./constants');
const getStat = require('./promised/get-stat');
const readDir = require('./promised/read-dir');

async function mapEntry (rawEntryPath) {
	const entryPath = resolve(rawEntryPath);
	const entryType = await getEntryType(entryPath);

	if (entryType === FILE) {
		return createFileMap(entryPath);
	}
	else if (entryType === FOLDER) {
		const folderMap = createFolderMap(entryPath);
		const entries = await readDir(entryPath);

		folderMap.entries = await mapEntries(entryPath, entries);

		return folderMap;
	}
}

function mapEntrySync (rawEntryPath) {
	const entryPath = resolve(rawEntryPath);
	const entryType = getEntryTypeSync(entryPath);

	if (entryType === FILE) {
		return createFileMap(entryPath);
	}
	else if (entryType === FOLDER) {
		const folderMap = createFolderMap(entryPath);
		const entries = readdirSync(entryPath);

		folderMap.entries = mapEntriesSync(entryPath, entries);

		return folderMap;
	}
}


function mapEntries (parentPath, entries) {
	const entriesMap = {};
	const promises = entries.map((entryName) => {
		const entryPath = join(parentPath, entryName);

		return mapEntry(entryPath).then((entryMap) => {
			entriesMap[entryName] = entryMap;
		});
	});

	return Promise.all(promises).then(() => entriesMap);
}

function mapEntriesSync (parentPath, entries) {
	const entriesMap = {};

	entries.forEach((entryName) => {
		const entryPath = join(parentPath, entryName);
		const entryMap = mapEntrySync(entryPath);

		entriesMap[entryName] = entryMap;
	});

	return entriesMap;
}


async function getEntryType (entryPath) {
	const statObj = await getStat(entryPath);
	const isFolder = statObj.isDirectory();

	return isFolder ? FOLDER : FILE;
}

function getEntryTypeSync (entryPath) {
	const statObj = statSync(entryPath);
	const isFolder = statObj.isDirectory();

	return isFolder ? FOLDER : FILE;
}


function createFileMap (filePath) {
	const {name, ext} = parse(filePath);

	return {
		path: filePath,
		type: FILE,
		name,
		ext: ext.substr(1),
	};
}

function createFolderMap (folderPath) {
	return {
		path: folderPath,
		type: FOLDER,
		entries: {},
	};
}

module.exports = mapEntry;
module.exports.sync = mapEntrySync;
