// eslint-disable-next-line max-statements, max-lines-per-function
module.exports = function getConfigs (opts) {
	if (opts && opts.isConfigured) return opts;
	let rawExclude = null;
	let rawInclude = null;
	let excludeNames = null;
	let excludeExtensions = null;
	let includeNames = null;
	let includeExtensions = null;
	let foldersOptsMap = null;
	let filter = null;
	let skipEmpty = false;

	if (Array.isArray(opts)) {
		rawExclude = opts;
	}
	else if (typeof opts == 'function') {
		filter = opts;
	}
	else if (typeof opts == 'object' && opts != null) {
		rawExclude = opts.exclude || null;
		rawInclude = opts.include || null;
		filter = opts.filter || null;
		skipEmpty = opts.skipEmpty || skipEmpty;

		if (rawInclude) {
			validateInclude(rawInclude);
			[
				includeNames,
				includeExtensions,
				foldersOptsMap
			] = separateNamesAndExtensions(rawInclude);

			skipEmpty = opts.skipEmpty == null ? true : skipEmpty;
		}
	}

	if (rawExclude) {
		validateExclude(rawExclude);
		[excludeNames, excludeExtensions] = separateNamesAndExtensions(rawExclude);
	}

	if (filter && typeof filter != 'function') {
		throw new Error('map-folder: `filter` must be a function.');
	}

	return {
		filter,
		skipEmpty,
		excludeNames,
		excludeExtensions,
		includeNames,
		includeExtensions,
		includeFolders: foldersOptsMap,
		isConfigured: true,
	};
};

function validateExclude (rawExclude) {
	if (!Array.isArray(rawExclude)) {
		throw new Error('map-folder: `exclude` option must be an array.');
	}

	rawExclude.forEach((item) => {
		if (!item || typeof item != 'string') {
			throw new Error('map-folder: `exclude` array should be an array of strings only.');
		}
	});
}

function validateInclude (rawInclude) {
	if (!Array.isArray(rawInclude)) {
		throw new Error('map-folder: `include` option must be an array.');
	}

	rawInclude.forEach((item) => {
		if (!item || (typeof item != 'string' && (typeof item != 'object' || !item.name))) {
			throw new Error('map-folder: `include` option must be an array of strings or objects. Objects must have a `name` property');
		}
	});
}

function separateNamesAndExtensions (rawArray) {
	let entryNames = [];
	let extensions = [];
	let foldersOpts = new Map();

	rawArray.forEach((item) => {
		if (typeof item == 'string') {
			item = item.toLowerCase();
		}
		else {
			foldersOpts.set(item.name, item);
			item = item.name;
		}

		if (item.startsWith('.')) extensions.push(item.substr(1));
		else entryNames.push(item);
	});

	if (!entryNames.length) entryNames = null;
	if (!extensions.length) extensions = null;
	if (!foldersOpts.size) foldersOpts = null;

	return [entryNames, extensions, foldersOpts];
}
