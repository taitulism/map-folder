const platform = require('os').platform();

const {
	FILE,
	winDefaultMode,
	LinuxFileDefaultMode,
	LinuxFolderDefaultMode,
} = require('./constants');

module.exports = function getDefaultModeByPlatform (entryType = FILE) {
	if (platform === 'win32') return winDefaultMode;

	if (entryType === FILE) return LinuxFileDefaultMode;

	return LinuxFolderDefaultMode;
};
