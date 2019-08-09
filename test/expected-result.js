const {resolve} = require('path');

const {DUMMY_FOLDER, FOLDER, FILE} = require('./constants');

module.exports = {
	path: resolve(`test/${DUMMY_FOLDER}`),
	type: FOLDER,
	entries: {
		aaa: {
			path: resolve(`test/${DUMMY_FOLDER}/aaa`),
			type: FOLDER,
			entries: {
				'bbb.min.js': {
					path: resolve(`test/${DUMMY_FOLDER}/aaa/bbb.min.js`),
					type: FILE,
					name: 'bbb.min',
					ext: 'js',
				},
			},
		},
		foo: {
			path: resolve(`test/${DUMMY_FOLDER}/foo`),
			type: FOLDER,
			entries: {
				bar: {
					path: resolve(`test/${DUMMY_FOLDER}/foo/bar`),
					type: FOLDER,
					entries: {
						'baz.js': {
							path: resolve(`test/${DUMMY_FOLDER}/foo/bar/baz.js`),
							type: FILE,
							name: 'baz',
							ext: 'js',
						},
					},
				},
			},
		},
		empty: {
			path: resolve(`test/${DUMMY_FOLDER}/empty`),
			type: FOLDER,
			entries: {},
		},
		'main.html': {
			path: resolve(`test/${DUMMY_FOLDER}/main.html`),
			type: FILE,
			name: 'main',
			ext: 'html',
		},
	},
};
