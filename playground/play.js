/* eslint-disable */
const mapFolder = require('../');

const map = mapFolder.sync('./test/dummy-folder', 'aaa');

console.log(map);
// map.then((res) => {
	// console.log(res);
// });

setTimeout(() => {}, 20000);
