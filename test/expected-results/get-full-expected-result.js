const getTestFolderPath = require('./get-test-folder-path');

// eslint-disable-next-line max-lines-per-function
module.exports = function getFullExpectedResult () {
	return {
		name: 'dummy-folder',
		isFolder: true,
		path: getTestFolderPath('/'),
		entries: {
			'article.doc': {
				name: 'article.doc',
				isFolder: false,
				base: 'article',
				ext: 'doc',
				path: getTestFolderPath('/article.doc'),
			},
			notes: {
				name: 'notes',
				isFolder: true,
				path: getTestFolderPath('/notes'),
				entries: {
					'wish-list.txt': {
						name: 'wish-list.txt',
						isFolder: false,
						base: 'wish-list',
						ext: 'txt',
						path: getTestFolderPath('/notes/wish-list.txt'),
					},
					empty: {
						name: 'empty',
						isFolder: true,
						path: getTestFolderPath('/notes/empty'),
						entries: {},
					},
					personal: {
						name: 'personal',
						isFolder: true,
						path: getTestFolderPath('/notes/personal'),
						entries: {
							'contacts.csv': {
								name: 'contacts.csv',
								isFolder: false,
								base: 'contacts',
								ext: 'csv',
								path: getTestFolderPath('/notes/personal/contacts.csv'),
							},
							'goals.txt': {
								name: 'goals.txt',
								isFolder: false,
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
				isFolder: true,
				path: getTestFolderPath('/diary'),
				entries: {
					'day-1.txt': {
						name: 'day-1.txt',
						isFolder: false,
						base: 'day-1',
						ext: 'txt',
						path: getTestFolderPath('/diary/day-1.txt'),
					},
					'day-2.txt': {
						name: 'day-2.txt',
						isFolder: false,
						base: 'day-2',
						ext: 'txt',
						path: getTestFolderPath('/diary/day-2.txt'),
					},
				}
			},
			code: {
				name: 'code',
				isFolder: true,
				path: getTestFolderPath('/code'),
				entries: {
					'app.js': {
						name: 'app.js',
						isFolder: false,
						base: 'app',
						ext: 'js',
						path: getTestFolderPath('/code/app.js'),
					},
					'app.min.js': {
						name: 'app.min.js',
						isFolder: false,
						base: 'app.min',
						ext: 'js',
						path: getTestFolderPath('/code/app.min.js'),
					},
					'index.html': {
						name: 'index.html',
						isFolder: false,
						base: 'index',
						ext: 'html',
						path: getTestFolderPath('/code/index.html'),
					},
					'style.css': {
						name: 'style.css',
						isFolder: false,
						base: 'style',
						ext: 'css',
						path: getTestFolderPath('/code/style.css'),
					},
					'.dotfile': {
						name: '.dotfile',
						isFolder: false,
						base: '',
						ext: 'dotfile',
						path: getTestFolderPath('/code/.dotfile'),
					},
					FLAG: {
						name: 'FLAG',
						isFolder: false,
						base: 'FLAG',
						ext: '',
						path: getTestFolderPath('/code/FLAG'),
					},
					images: {
						name: 'images',
						isFolder: true,
						path: getTestFolderPath('/code/images'),
						entries: {
							'logo.png': {
								name: 'logo.png',
								isFolder: false,
								base: 'logo',
								ext: 'png',
								path: getTestFolderPath('/code/images/logo.png'),
							},
							'photo.jpg': {
								name: 'photo.jpg',
								isFolder: false,
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
};
