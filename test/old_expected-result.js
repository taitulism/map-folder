const {resolve} = require('path');

const {FOLDER, FILE} = require('../index');

const DUMMY_FOLDER = 'dummy-folder';

function testFolder (dummyPath) {
	return resolve(`test/${DUMMY_FOLDER}/${dummyPath}`);
}

// eslint-disable-next-line max-lines-per-function
module.exports = function getExpectedResult () {
	return {
		name: 'dummy-folder',
		path: testFolder(''),
		type: FOLDER,
		entries: {
			aaa: {
				name: 'aaa',
				path: testFolder('/aaa'),
				type: FOLDER,
				entries: {
					'bbb.min.js': {
						path: testFolder('/aaa/bbb.min.js'),
						type: FILE,
						name: 'bbb.min.js',
						base: 'bbb.min',
						ext: 'js',
					},
				},
			},
			foo: {
				name: 'foo',
				path: testFolder('/foo'),
				type: FOLDER,
				entries: {
					bar: {
						name: 'bar',
						path: testFolder('/foo/bar'),
						type: FOLDER,
						entries: {
							'baz.js': {
								path: testFolder('/foo/bar/baz.js'),
								type: FILE,
								name: 'baz.js',
								base: 'baz',
								ext: 'js',
							},
						},
					},
				},
			},
			empty: {
				name: 'empty',
				path: testFolder('/empty'),
				type: FOLDER,
				entries: {},
			},
			'main.html': {
				path: testFolder('/main.html'),
				type: FILE,
				name: 'main.html',
				base: 'main',
				ext: 'html',
			},
		},
	};
};
