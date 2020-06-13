/* eslint-disable */
const mapFolder = require('../');

const map = mapFolder('./test/dummy-folder', ['bbb.min.js', 'empty']);

map.then((res) => {
	console.log(res);
});

setTimeout(() => {}, 20000);
