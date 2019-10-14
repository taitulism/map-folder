const {resolve} = require('path');

const {DUMMY_FOLDER, FOLDER, FILE} = require('./constants');

function testFolder (dummyPath) {
	return resolve(`test/${DUMMY_FOLDER}/${dummyPath}`);
}

module.exports = {
	path: testFolder(''),
	type: FOLDER,
	entries: {
		aaa: {
			path: testFolder('/aaa'),
			type: FOLDER,
			entries: {
				'bbb.min.js': {
					path: testFolder('/aaa/bbb.min.js'),
					type: FILE,
					name: 'bbb.min',
					ext: 'js',
				},
			},
		},
		foo: {
			path: testFolder('/foo'),
			type: FOLDER,
			entries: {
				bar: {
					path: testFolder('/foo/bar'),
					type: FOLDER,
					entries: {
						'baz.js': {
							path: testFolder('/foo/bar/baz.js'),
							type: FILE,
							name: 'baz',
							ext: 'js',
						},
					},
				},
			},
		},
		empty: {
			path: testFolder('/empty'),
			type: FOLDER,
			entries: {},
		},
		'main.html': {
			path: testFolder('/main.html'),
			type: FILE,
			name: 'main',
			ext: 'html',
		},
	},
};
