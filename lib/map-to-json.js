'use strict';

const fs    = require('fs');
const $path = require('path');

// const OsDirSep = $path.sep;
const joinPath = $path.join;

const FOLDER  = 0;
const FILE    = 1;
// const SYMLINK = 2;

const getDirEntries = fs.readdir;
const stat          = fs.stat;

function mapToJson (folderPath, callback) {
    console.log(folderPath);

    const folderMapObj = {
        path: folderPath,
        type: FOLDER,
        entries: {}
    };

    getDirEntries(folderPath, (entryErr, entries) => {
        if (entryErr) {
            return callback(entryErr, null);
        }

        const entriesLen = entries.length;

        if (entriesLen === 0) {
            console.log('no entries');
            return callback(null, folderMapObj);
        }

        entries.forEach((entryName, i) => {
            const entryPath = joinPath(folderPath, entryName);
            
            console.log(i, entryPath);
            
            stat(entryPath, (statErr, entryStat) => {
                if (statErr) {
                    return callback(statErr, null);
                }

                const type = getType(entryStat);

                if (type === FILE) {
                    folderMapObj.entries[entryName] = {
                        path: entryPath,
                        type: FILE
                    };
                }
                else {
                    // FOLDER
                    mapToJson(entryPath, (mapErr, result) => {
                        folderMapObj.entries[entryName] = result;
                        console.log('adding', entryName, 'to', folderMapObj.path);
                        if (i === (entriesLen - 1)) {
                            return callback(null, folderMapObj);
                        }
                    });
                }

                if (i === (entriesLen - 1)) {
                    console.log('po');
                    return callback(null, folderMapObj);
                }
            });
        });
    });
}

function getType (entryStat) {
    const isFolder = entryStat.isDirectory();

    if (isFolder) {
        return FOLDER;
    }
    
    return FILE;

    // only with fs.lstat (currently using fs.stat)
    /*
        const isFile = entryStat.isFile();

        if (isFile) {
            return FILE;
        }

        return SYMLINK;
    */
}

module.exports = mapToJson;
