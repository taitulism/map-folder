/* eslint-disable eqeqeq */
const {statSync, readdirSync} = require('fs');
const {resolve, parse, join} = require('path');

const getStat = require('./promised/get-stat');
const readDir = require('./promised/read-dir');
const getConfigs = require('./get-configs');

function mapEntry (rawEntryPath, opts) {
	const cfg = getConfigs(opts);
	const entryPath = resolve(rawEntryPath);

	return cfg.async
		? mapEntryAsync(entryPath, cfg)
		: mapEntrySync(entryPath, cfg)
	;
}

async function mapEntryAsync (entryPath, cfg) {
	const isFolder = (await getStat(entryPath)).isDirectory();
	const entryMap = createEntryMap(entryPath, isFolder);

	if (!shouldBeMapped(entryMap, cfg)) return null;
	if (!isFolder) return entryMap;

	// Folder
	const entries = await readDir(entryPath);
	const entryName = entryMap.name.toLowerCase();
	const subOpts = getSubFolderOpts(entryName, cfg);
	const entriesObj = await mapEntriesAsync(entryPath, entries, subOpts || cfg);

	if (cfg.skipEmpty && !Object.keys(entriesObj).length) return null;
	if (entriesObj) entryMap.entries = entriesObj;

	return entryMap;
}

function mapEntrySync (entryPath, cfg) {
	const isFolder = statSync(entryPath).isDirectory();
	const entryMap = createEntryMap(entryPath, isFolder);

	if (!shouldBeMapped(entryMap, cfg)) return null;
	if (!isFolder) return entryMap;

	// Folder
	const entries = readdirSync(entryPath);
	const entryName = entryMap.name.toLowerCase();
	const subOpts = getSubFolderOpts(entryName, cfg);
	const entriesObj = mapEntriesSync(entryPath, entries, subOpts || cfg);

	if (cfg.skipEmpty && !Object.keys(entriesObj).length) return null;
	if (entriesObj) entryMap.entries = entriesObj;

	return entryMap;
}

function mapEntriesAsync (parentPath, entries, cfg) {
	if (!entries.length) return {};
	const entriesObj = {};

	const promises = entries.map((entryName) => {
		const entryPath = join(parentPath, entryName);

		return mapEntryAsync(entryPath, cfg).then((entryMap) => {
			if (entryMap) entriesObj[entryName] = entryMap;
		});
	});

	return Promise.all(promises).then(() => entriesObj);
}

function mapEntriesSync (parentPath, entries, cfg) {
	if (!entries.length) return {};
	const entriesObj = {};

	entries.forEach((entryName) => {
		const entryPath = join(parentPath, entryName);
		const entryMap = mapEntrySync(entryPath, cfg);

		if (entryMap) entriesObj[entryName] = entryMap;
	});

	return entriesObj;
}

function getSubFolderOpts (entryName, cfg) {
	if (cfg.includeNames && cfg.includeNames.includes(entryName)) {
		if (cfg.includeFolders && cfg.includeFolders.has(entryName)) {
			const opts = cfg.includeFolders.get(entryName);
			return getConfigs(opts);
		}
		return {};
	}

	return null;
}

function createEntryMap (entryPath, isFolder) {
	const pathObj = parse(entryPath);

	const {base, name, ext} = pathObj;
	const entryMap = {
		isFolder,
		path: entryPath,
		name: base,
	};

	if (!isFolder) {
		entryMap.name = base;

		// .dotfile
		if (name.startsWith('.') && !ext) {
			entryMap.base = '';
			entryMap.ext = name.substr(1);
		}
		else {
			entryMap.base = name;
			entryMap.ext = ext.substr(1);
		}
	}

	return entryMap;
}

function shouldBeMapped (entryMap, cfg) {
	const {
		filter,
		excludeNames,
		excludeExtensions,
		includeNames,
		includeExtensions,
	} = cfg;

	const defaultRetVal = !(includeNames || includeExtensions);
	const entryName = entryMap.name.toLowerCase();

	if (includeNames && includeNames.includes(entryName)) return true;
	if (excludeNames && excludeNames.includes(entryName)) return false;

	if (entryMap.isFolder) return (filter) ? filter(entryMap) : true;

	const fileExt = entryMap.ext.toLowerCase();

	if (includeExtensions && includeExtensions.includes(fileExt)) return true;
	if (excludeExtensions && excludeExtensions.includes(fileExt)) return false;

	if (filter) return filter(entryMap);

	return defaultRetVal;
}

module.exports = mapEntry;
