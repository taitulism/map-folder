'use strict';

const getEntryType = require('./get-entry-type');
const getOctalMode = require('./get-octal-mode');

/*
  │ Circular Dependency Issue:
  │ *mapFolder* requires forEachEntry
  │ forEachEntry requires handleEntryStat
  │ handleEntryStat requires *mapFolder*
*/
let mapFolder;

const FILE = require('./constants').FILE;

module.exports = function (folderMapObj, entryTempObj, done) {
    const {
        fileName,
        name,
        path,
        ext,
        stat,
    } = entryTempObj;
    
    const type = getEntryType(stat);

    if (type === FILE) {
        const size = stat.size;

        folderMapObj.entries[fileName] = {
            name,
            path,
            size,
            ext,
            type: FILE,
            mode: getOctalMode(stat.mode)
        };

        folderMapObj.size += size;

        done(null, folderMapObj);
    }
    else { // FOLDER

        // circular dependency fix:
        mapFolder = mapFolder || require('./map-folder');

        mapFolder(path, (mapErr, result) => {
            folderMapObj.entries[name] = result;
            folderMapObj.size += result.size;

            done(null, folderMapObj);
        });
    }
};
