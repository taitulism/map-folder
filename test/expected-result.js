const {resolve: resolvePath} = require('path');

const {DUMMY_FOLDER} = require('./constants');

module.exports = {
	path: resolvePath(`test/${DUMMY_FOLDER}`),
	type: 0,
	entries: {
		'index.js': {
			path: resolvePath(`test/${DUMMY_FOLDER}/index.js`),
			type: 1,
			name: 'index',
			ext: 'js',
		},
		// eslint-disable-next-line id-length
		a: {
			path: resolvePath(`test/${DUMMY_FOLDER}/a`),
			type: 0,
			entries: {
				'index.js': {
					path: resolvePath(`test/${DUMMY_FOLDER}/a/index.js`),
					type: 1,
					name: 'index',
					ext: 'js',
				},
			},
		},
		// eslint-disable-next-line id-length
		b: {
			path: resolvePath(`test/${DUMMY_FOLDER}/b`),
			type: 0,
			entries: {
				'index.js': {
					path: resolvePath(`test/${DUMMY_FOLDER}/b/index.js`),
					type: 1,
					name: 'index',
					ext: 'js',
				},
			},
		},
	},
};
