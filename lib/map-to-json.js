'use strict';

const fs    = require('fs');
const $path = require('path');

// const OsDirSep = $path.sep;
const joinPath = $path.join;

const FOLDER  = 0;
const FILE    = 1;
// const SYMLINK = 2;

const fsReadDir = fs.readdir;
const fsStat    = fs.stat;

function mapToJson (folderPath, endCallBack) {
    const folderMapObj = {
        path: folderPath,
        type: FOLDER,
        entries: {}
    };

    fsReadDir(folderPath, (entryErr, entries) => {
        if (entryErr) {
            throw entryErr;
        }
        
        const entriesLen = entries.length;

        if (entriesLen === 0) {
            return endCallBack(null, folderMapObj);
        }
        
        let doneCount = 0;

        function done (err) {
            if (err) {
                endCallBack(err, null);
            }

            doneCount++;

            if (doneCount === entriesLen) {
                endCallBack(null, folderMapObj);
            }
        }

        readEntries(folderMapObj, entries, done);
    });
}


function readEntries (folderMapObj, entries, done) {
    entries.forEach((name) => {
        const entryTempObj = {
            name,
            path: joinPath(folderMapObj.path, name)
        };

        forEachEntry(folderMapObj, entryTempObj, done);
    });
}


function forEachEntry (folderMapObj, entryTempObj, done) {
    const path = entryTempObj.path;

    fsStat(path, (statErr, entryStat) => {
        if (statErr) {
            return done(statErr);
        }

        entryTempObj.stat = entryStat;

        statEntry(folderMapObj, entryTempObj, done);
    });
}

function statEntry (folderMapObj, entryTempObj, done) {
    const {
        name,
        path,
        stat
    } = entryTempObj;
    
    const type = getType(stat);

    if (type === FILE) {
        folderMapObj.entries[name] = {
            path,
            type: FILE
        };

        done(null, folderMapObj);
    }
    else { // FOLDER
        mapToJson(path, (mapErr, result) => {
            folderMapObj.entries[name] = result;

            done(null, folderMapObj);
        });
    }
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
