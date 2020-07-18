const getTestFolderPath = require('./get-test-folder-path');

// eslint-disable-next-line max-lines-per-function
module.exports = function getFullExpectedResult () {
	return {
		name: 'dummy-folder',
		type: 0,
		path: getTestFolderPath('/'),
		entries: {
			'article.doc': {
				name: 'article.doc',
				type: 1,
				base: 'article',
				ext: 'doc',
				path: getTestFolderPath('/article.doc'),
			},
			notes: {
				name: 'notes',
				type: 0,
				path: getTestFolderPath('/notes'),
				entries: {
					'wish-list.txt': {
						name: 'wish-list.txt',
						type: 1,
						base: 'wish-list',
						ext: 'txt',
						path: getTestFolderPath('/notes/wish-list.txt'),
					},
					empty: {
						name: 'empty',
						type: 0,
						path: getTestFolderPath('/notes/empty'),
						entries: {},
					},
					personal: {
						name: 'personal',
						type: 0,
						path: getTestFolderPath('/notes/personal'),
						entries: {
							'contacts.csv': {
								name: 'contacts.csv',
								type: 1,
								base: 'contacts',
								ext: 'csv',
								path: getTestFolderPath('/notes/personal/contacts.csv'),
							},
							'goals.txt': {
								name: 'goals.txt',
								type: 1,
								base: 'goals',
								ext: 'txt',
								path: getTestFolderPath('/notes/personal/goals.txt'),
							},
						}
					}
				}
			},
			diary: {
				name: 'diary',
				type: 0,
				path: getTestFolderPath('/diary'),
				entries: {
					'day-1.txt': {
						name: 'day-1.txt',
						type: 1,
						base: 'day-1',
						ext: 'txt',
						path: getTestFolderPath('/diary/day-1.txt'),
					},
					'day-2.txt': {
						name: 'day-2.txt',
						type: 1,
						base: 'day-2',
						ext: 'txt',
						path: getTestFolderPath('/diary/day-2.txt'),
					},
				}
			},
			code: {
				name: 'code',
				type: 0,
				path: getTestFolderPath('/code'),
				entries: {
					'app.js': {
						name: 'app.js',
						type: 1,
						base: 'app',
						ext: 'js',
						path: getTestFolderPath('/code/app.js'),
					},
					'app.min.js': {
						name: 'app.min.js',
						type: 1,
						base: 'app.min',
						ext: 'js',
						path: getTestFolderPath('/code/app.min.js'),
					},
					'index.html': {
						name: 'index.html',
						type: 1,
						base: 'index',
						ext: 'html',
						path: getTestFolderPath('/code/index.html'),
					},
					'style.css': {
						name: 'style.css',
						type: 1,
						base: 'style',
						ext: 'css',
						path: getTestFolderPath('/code/style.css'),
					},
					'.dotfile': {
						name: '.dotfile',
						type: 1,
						base: '',
						ext: 'dotfile',
						path: getTestFolderPath('/code/.dotfile'),
					},
					FLAG: {
						name: 'FLAG',
						type: 1,
						base: 'FLAG',
						ext: '',
						path: getTestFolderPath('/code/FLAG'),
					},
					images: {
						name: 'images',
						type: 0,
						path: getTestFolderPath('/code/images'),
						entries: {
							'logo.png': {
								name: 'logo.png',
								type: 1,
								base: 'logo',
								ext: 'png',
								path: getTestFolderPath('/code/images/logo.png'),
							},
							'photo.jpg': {
								name: 'photo.jpg',
								type: 1,
								base: 'photo',
								ext: 'jpg',
								path: getTestFolderPath('/code/images/photo.jpg'),
							},
						}
					},
				}
			}
		}
	};
}

