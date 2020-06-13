const mapFolder = require('../');

const map = mapFolder.sync('./test/dummy-folder');

console.log(map);

setTimeout(() => {}, 20000)
