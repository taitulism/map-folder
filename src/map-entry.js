const {statSync, readdirSync} = require('fs');
const {resolve, parse, join} = require('path');

const {FILE, FOLDER} = require('./constants');
const getStat = require('./promised/get-stat');
const readDir = require('./promised/read-dir');

async function mapEntry (rawEntryPath, ignore) {
	const entryPath = resolve(rawEntryPath);
	const entryType = await getEntryType(entryPath);
	const {name, ext, base} = parse(entryPath);

	if (ignore && shouldBeIgnored(base, ignore)) {
		return null;
	}

	if (entryType === FILE) {
		return createFileMap(name, ext, entryPath);
	}
	else if (entryType === FOLDER) {
		const folderMap = createFolderMap(entryPath);
		const entries = await readDir(entryPath);
		const entriesMaps = await mapEntries(entryPath, entries, ignore);

		if (entriesMaps) folderMap.entries = entriesMaps;

		return folderMap;
	}
}

function mapEntrySync (rawEntryPath, ignore) {
	const entryPath = resolve(rawEntryPath);
	const entryType = getEntryTypeSync(entryPath);
	const {name, ext, base} = parse(entryPath);

	if (ignore && shouldBeIgnored(base, ignore)) {
		return null;
	}

	if (entryType === FILE) {
		return createFileMap(name, ext, entryPath);
	}
	else if (entryType === FOLDER) {
		const folderMap = createFolderMap(entryPath);
		const entries = readdirSync(entryPath);
		const entriesMaps = mapEntriesSync(entryPath, entries, ignore);

		if (entriesMaps) folderMap.entries = entriesMaps;

		return folderMap;
	}
}


function mapEntries (parentPath, entries, ignore) {
	const entriesMap = {};
	const promises = entries.map((entryName) => {
		const entryPath = join(parentPath, entryName);

		return mapEntry(entryPath, ignore).then((entryMap) => {
			if (entryMap) entriesMap[entryName] = entryMap;
		});
	});

	return Promise.all(promises).then(() => entriesMap);
}

function mapEntriesSync (parentPath, entries, ignore) {
	const entriesMap = {};

	entries.forEach((entryName) => {
		const entryPath = join(parentPath, entryName);
		const entryMap = mapEntrySync(entryPath, ignore);

		if (entryMap) entriesMap[entryName] = entryMap;
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


function createFileMap (name, ext, filePath) {
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

function shouldBeIgnored (name, ignore) {
	const ignoreType = typeof ignore;

	if (ignoreType == 'string') {
		if (name.toLowerCase() === ignore.toLowerCase()) {
			return true;
		}
	}
	else if (ignoreType == 'function') {
		return ignore(name);
	}
	else if (Array.isArray(ignore)) {
		const len = ignore.length;

		for (let i = 0; i < len; i++) {
			const ignoreItem = ignore[i];

			if (name.toLowerCase() === ignoreItem.toLowerCase()) {
				return true;
			}
		}
	}

	return false;
}

module.exports = mapEntry;
module.exports.sync = mapEntrySync;
