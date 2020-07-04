/* eslint-disable eqeqeq */
const {statSync, readdirSync} = require('fs');
const {resolve, parse, join} = require('path');

const {FILE, FOLDER} = require('./constants');
const getStat = require('./promised/get-stat');
const readDir = require('./promised/read-dir');
const getConfig = require('./get-configs');

async function mapEntry (rawEntryPath, opts, force) {
	const cfg = getConfig(opts);
	const entryPath = resolve(rawEntryPath);
	const entryType = await getEntryType(entryPath);
	const entryMap = createEntryMap(entryPath, entryType);

	if (!shouldBeMapped(entryMap, cfg) && !force) return null;
	if (entryType === FILE) return entryMap;
	if (entryType === FOLDER) {
		const entries = await readDir(entryPath);
		const entryName = entryMap.name.toLowerCase();

		if (cfg.onlyNames && cfg.onlyNames.includes(entryName)) force = true;

		const entriesObj = await mapEntries(entryPath, entries, opts, force);

		if (cfg.onlyNames && cfg.skipEmpty && !Object.keys(entriesObj).length) return null;
		if (cfg.onlyExtensions && cfg.skipEmpty && !Object.keys(entriesObj).length) return null;
		if (entriesObj) entryMap.entries = entriesObj;

		return entryMap;
	}
}

function mapEntrySync (rawEntryPath, opts, force) {
	const cfg = getConfig(opts);
	const entryPath = resolve(rawEntryPath);
	const entryType = getEntryTypeSync(entryPath);
	const entryMap = createEntryMap(entryPath, entryType);

	if (!shouldBeMapped(entryMap, cfg) && !force) return null;
	if (entryType === FILE) return entryMap;
	if (entryType === FOLDER) {
		const entries = readdirSync(entryPath);
		const entryName = entryMap.name.toLowerCase();

		if (cfg.onlyNames && cfg.onlyNames.includes(entryName)) force = true;

		const entriesObj = mapEntriesSync(entryPath, entries, opts, force);

		if (cfg.onlyNames && cfg.skipEmpty && !Object.keys(entriesObj).length) return null;
		if (cfg.onlyExtensions && cfg.skipEmpty && !Object.keys(entriesObj).length) return null;
		if (entriesObj) entryMap.entries = entriesObj;

		return entryMap;
	}
}

function mapEntries (parentPath, entries, opts, force) {
	if (!entries.length) return {};
	const entriesObj = {};

	const promises = entries.map((entryName) => {
		const entryPath = join(parentPath, entryName);

		return mapEntry(entryPath, opts, force).then((entryMap) => {
			if (entryMap) entriesObj[entryName] = entryMap;
		});
	});

	return Promise.all(promises).then(() => entriesObj);
}

function mapEntriesSync (parentPath, entries, opts, force) {
	if (!entries.length) return {};
	const entriesObj = {};

	entries.forEach((entryName) => {
		const entryPath = join(parentPath, entryName);
		const entryMap = mapEntrySync(entryPath, opts, force);

		if (entryMap) entriesObj[entryName] = entryMap;
	});

	return entriesObj;
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

function createEntryMap (entryPath, entryType) {
	const pathObj = parse(entryPath);

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

function shouldBeMapped (entryMap, cfg) {
	const {
		skipNames,
		skipExtensions,
		onlyNames,
		onlyExtensions,
		filter,
	} = cfg;

	if (filter) return filter(entryMap);

	const entryName = entryMap.name.toLowerCase();

	if (skipNames && skipNames.includes(entryName)) return false;
	if (entryMap.type === FOLDER) return true;

	const fileExt = entryMap.ext.toLowerCase();

	if (onlyExtensions && onlyExtensions.includes(fileExt)) return true;
	if (onlyNames && onlyNames.includes(entryName)) return true;

	if (skipExtensions) return !skipExtensions.includes(fileExt);

	const defaultVal = !(onlyNames || onlyExtensions);

	return defaultVal;
}

module.exports.async = mapEntry;
module.exports.sync = mapEntrySync;
