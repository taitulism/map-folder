const {resolve: resolvePath} = require('path');

const getDefaultModeByPlatform = require('./get-default-mode-by-platform');
const {FILE, FOLDER, DUMMY_FOLDER} = require('./constants');

module.exports = {
	mode: getDefaultModeByPlatform(FOLDER),
	path: resolvePath(`test/${DUMMY_FOLDER}`),
	size: 24,
	type: 0,
	len: 3,
	entries: {
		'index.js': {
			mode: getDefaultModeByPlatform(FILE),
			path: resolvePath(`test/${DUMMY_FOLDER}/index.js`),
			size: 10,
			type: 1,
			name: 'index',
			ext: 'js',
		},
		// eslint-disable-next-line id-length
		a: {
			mode: getDefaultModeByPlatform(FOLDER),
			path: resolvePath(`test/${DUMMY_FOLDER}/a`),
			size: 7,
			type: 0,
			len: 1,
			entries: {
				'index.js': {
					mode: getDefaultModeByPlatform(FILE),
					path: resolvePath(`test/${DUMMY_FOLDER}/a/index.js`),
					size: 7,
					type: 1,
					name: 'index',
					ext: 'js',
				},
			},
		},
		// eslint-disable-next-line id-length
		b: {
			mode: getDefaultModeByPlatform(FOLDER),
			path: resolvePath(`test/${DUMMY_FOLDER}/b`),
			size: 7,
			type: 0,
			len: 1,
			entries: {
				'index.js': {
					mode: getDefaultModeByPlatform(FILE),
					path: resolvePath(`test/${DUMMY_FOLDER}/b/index.js`),
					size: 7,
					type: 1,
					name: 'index',
					ext: 'js',
				},
			},
		},
	},
};
