'use strict';

const {
    FILE,
    FOLDER
} = require('./constants');

module.exports = function (entryStat) {
    const isFolder = entryStat.isDirectory();

    if (isFolder) {
        return FOLDER;
    }
    
    // TODO: SYMLINK - only with fs.lstat (currently using fs.stat)
    /*
        const isFile = entryStat.isFile();

        if (isFile) {
            return FILE;
        }

        return SYMLINK;
    */

    return FILE;
};
