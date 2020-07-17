// eslint-disable-next-line max-statements, max-lines-per-function, complexity
module.exports = function getConfigs (opts) {
	if (opts && opts.isConfigured) return opts;
	let rawExclude = null;
	let rawMapOnly = null;
	let skipNames = null;
	let skipExtensions = null;
	let onlyNames = null;
	let onlyExtensions = null;
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
		rawMapOnly = opts.include || null;
		filter = opts.filter || null;
		skipEmpty = opts.skipEmpty || skipEmpty;

		if (rawMapOnly) {
			if (typeof rawMapOnly != 'string' && !Array.isArray(rawMapOnly)) {
				throw new Error('map-folder: `include` must be either a string or an array.');
			}

			onlyNames = [];
			onlyExtensions = [];
			if (typeof rawMapOnly == 'string') rawMapOnly = [rawMapOnly];

			rawMapOnly.forEach((item) => {
				item = item.toLowerCase();
				if (item.startsWith('.')) onlyExtensions.push(item.substr(1));
				else onlyNames.push(item);
			});

			if (!onlyNames.length) onlyNames = null;
			if (!onlyExtensions.length) onlyExtensions = null;
			if (onlyNames || onlyExtensions) skipEmpty = opts.skipEmpty == null ? true : skipEmpty;
		}

		if (onlyExtensions && skipExtensions) {
			throw new Error('map-folder: Use either `onlyExtensions` OR `skipExtensions` but not both.');
		}
	}

	if (rawExclude) {
		if (typeof rawExclude != 'string' && !Array.isArray(rawExclude)) {
			throw new Error('map-folder: `exclude` must be either a string or an array.');
		}

		skipNames = [];
		skipExtensions = [];
		if (typeof rawExclude == 'string') rawExclude = [rawExclude];

		rawExclude.forEach((item) => {
			item = item.toLowerCase();
			if (item.startsWith('.')) skipExtensions.push(item.substr(1));
			else skipNames.push(item);
		});

		if (!skipNames.length) skipNames = null;
		if (!skipExtensions.length) skipExtensions = null;
	}

	if (filter && typeof filter != 'function') {
		throw new Error('map-folder: `filter` must be a function.');
	}

	return {
		filter,
		skipEmpty,
		skipNames,
		skipExtensions,
		onlyNames,
		onlyExtensions,
		isConfigured: true,
	};
};
