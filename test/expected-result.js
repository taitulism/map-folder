const {resolve: resolvePath} = require('path');

const getDefaultModeByPlatform = require('./get-default-mode-by-platform');
const {FILE, FOLDER, DUMMY_FOLDER} = require('./constants');

module.exports = {
	mode: getDefaultModeByPlatform(FOLDER),
	path: resolvePath(`test/${DUMMY_FOLDER}`),
	type: 0,
	len: 3,
	entries: {
		'index.js': {
			mode: getDefaultModeByPlatform(FILE),
			path: resolvePath(`test/${DUMMY_FOLDER}/index.js`),
			type: 1,
			name: 'index',
			ext: 'js',
		},
		// eslint-disable-next-line id-length
		a: {
			mode: getDefaultModeByPlatform(FOLDER),
			path: resolvePath(`test/${DUMMY_FOLDER}/a`),
			type: 0,
			len: 1,
			entries: {
				'index.js': {
					mode: getDefaultModeByPlatform(FILE),
					path: resolvePath(`test/${DUMMY_FOLDER}/a/index.js`),
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
			type: 0,
			len: 1,
			entries: {
				'index.js': {
					mode: getDefaultModeByPlatform(FILE),
					path: resolvePath(`test/${DUMMY_FOLDER}/b/index.js`),
					type: 1,
					name: 'index',
					ext: 'js',
				},
			},
		},
	},
};
