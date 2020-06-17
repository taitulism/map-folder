/* eslint-disable eqeqeq */
const {statSync, readdirSync} = require('fs');
const {resolve, parse, join} = require('path');

const {FILE, FOLDER} = require('./constants');
const getStat = require('./promised/get-stat');
const readDir = require('./promised/read-dir');

async function mapEntry (rawEntryPath, ignore) {
	const entryPath = resolve(rawEntryPath);
	const entryType = await getEntryType(entryPath);
	const pathObj = parse(entryPath);
	const entryMap = createEntryMap(entryPath, entryType, pathObj);

	if (shouldBeIgnored(entryMap, ignore)) return null;
	if (entryType === FILE) return entryMap;
	if (entryType === FOLDER) {
		const entries = await readDir(entryPath);
		const entriesMaps = await mapEntries(entryPath, entries, ignore);

		if (entriesMaps) entryMap.entries = entriesMaps;

		return entryMap;
	}
}

function mapEntrySync (rawEntryPath, ignore) {
	const entryPath = resolve(rawEntryPath);
	const entryType = getEntryTypeSync(entryPath);
	const pathObj = parse(entryPath);
	const entryMap = createEntryMap(entryPath, entryType, pathObj);

	if (shouldBeIgnored(entryMap, ignore)) return null;
	if (entryType === FILE) return entryMap;
	if (entryType === FOLDER) {
		const entries = readdirSync(entryPath);
		const entriesMaps = mapEntriesSync(entryPath, entries, ignore);

		if (entriesMaps) entryMap.entries = entriesMaps;

		return entryMap;
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


function createEntryMap (entryPath, entryType, pathObj) {
	const {base, name, ext} = pathObj;
	const entryMap = {
		path: entryPath,
		type: entryType,
	};

	if (entryType === FILE) {
		entryMap.name = base;
		entryMap.base = name;
		entryMap.ext = ext.substr(1);
	}
	else if (entryType === FOLDER) {
		entryMap.name = base;
	}

	return entryMap;
}

function shouldBeIgnored (pathObj, ignore) {
	if (!ignore) return false;

	const ignoreType = typeof ignore;

	if (ignoreType == 'string') {
		if (pathObj.name.toLowerCase() === ignore.toLowerCase()) {
			return true;
		}
	}
	else if (ignoreType == 'function') {
		// used as a predicate function (like filter)
		return !ignore(pathObj);
	}
	else if (Array.isArray(ignore)) {
		const len = ignore.length;

		for (let i = 0; i < len; i++) {
			const ignoreItem = ignore[i];

			if (pathObj.name.toLowerCase() === ignoreItem.toLowerCase()) {
				return true;
			}
		}
	}

	return false;
}

module.exports = mapEntry;
module.exports.sync = mapEntrySync;
