/* eslint-disable */
const mapFolder = require('../');

const map = mapFolder.sync('./test/dummy-folder', {
	exclude: ['node_modules', 'configs.js', '.log'],
	include: ['.js', '_index_only', 'public', 'debug.log'],
});


// include: ['.js', '_index_only', 'public', {name: 'images', include: ['.png', '.jpg']}],

// const map = mapFolder.sync('./test/dummy-folder', {
// 	includeExt: ['csv', 'doc'],
// 	skipEmpty: false,
// });

console.log(map);
// map.then((res) => {
	// console.log(res);
// });

setTimeout(() => {}, 20000);
