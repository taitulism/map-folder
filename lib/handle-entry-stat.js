'use strict';

const getEntryType = require('./get-entry-type');
const getOctalMode = require('./get-octal-mode');


let mapFolder;

const FILE = require('./constants').FILE;

module.exports = function (folderMapObj, entryTempObj, done) {
    const {
        name,
        path,
        stat
    } = entryTempObj;
    
    const type = getEntryType(stat);

    if (type === FILE) {
        folderMapObj.entries[name] = {
            path,
            type: FILE,
            mode: getOctalMode(stat.mode)
        };

        done(null, folderMapObj);
    }
    else { // FOLDER
    /* 
        mapFolder(!) requires forEachEntry 
        forEachEntry requires handleEntryStat 
        handleEntryStat requires mapFolder(!)
    */
    mapFolder = mapFolder || require('./map-folder');
        mapFolder(path, (mapErr, result) => {
            folderMapObj.entries[name] = result;

            done(null, folderMapObj);
        });
    }
};
