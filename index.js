const {async, sync} = require('./src/map-entry');
const {FILE, FOLDER} = require('./src/constants');

module.exports = async;
module.exports.mapFolder = async;
module.exports.mapFolderSync = sync;

module.exports.FILE = FILE;
module.exports.FOLDER = FOLDER;
