// eslint-disable-next-line max-statements, max-lines-per-function, complexity
module.exports = function getConfigs (opts) {
	if (opts && opts.isConfigured) return opts;
	let rawExclude = null;
	let rawInclude = null;
	let excludeNames = null;
	let excludeExtensions = null;
	let includeNames = null;
	let includeExtensions = null;
	let filter = null;
	let skipEmpty = false;

	if (typeof opts == 'string' || Array.isArray(opts)) {
		rawExclude = opts;
	}
	else if (typeof opts == 'function') {
		filter = opts;
	}
	else if (typeof opts == 'object') {
		rawExclude = opts.exclude || null;
		rawInclude = opts.include || null;
		filter = opts.filter || null;
		skipEmpty = opts.skipEmpty || skipEmpty;

		if (rawInclude) {
			rawInclude = normalizeStringArray('include', rawInclude);
			[includeNames, includeExtensions] = separateNamesAndExtensions(rawInclude);
			skipEmpty = opts.skipEmpty == null ? true : skipEmpty;
		}
	}

	if (rawExclude) {
		rawExclude = normalizeStringArray('exclude', rawExclude);
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
		isConfigured: true,
	};
};

function normalizeStringArray (optName, optValue) {
	if (typeof optValue != 'string' && !Array.isArray(optValue)) {
		throw new Error(`map-folder: \`${optName}\` must be either a string or an array.`);
	}

	return typeof optValue == 'string' ? [optValue] : optValue;
}

function separateNamesAndExtensions (bothAry) {
	let entryNames = [];
	let extensions = [];

	bothAry.forEach((item) => {
		item = item.toLowerCase();
		if (item.startsWith('.')) extensions.push(item.substr(1));
		else entryNames.push(item);
	});

	if (!entryNames.length) entryNames = null;
	if (!extensions.length) extensions = null;

	return [entryNames, extensions];
}
