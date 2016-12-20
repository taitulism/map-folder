'use strict';

const fs    = require('fs');
const $path = require('path');

// const OsDirSep = $path.sep;
const joinPath = $path.join;
const resolvePath = $path.resolve;

const FOLDER  = 0;
const FILE    = 1;
// const SYMLINK = 2;

const fsReadDir = fs.readdir;
const fsStat    = fs.stat;

function toJson (folderPath, endCallBack) {
    const folderMapObj = {
        path: resolvePath(folderPath),
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
        
        const done = createDone(folderMapObj, entriesLen, endCallBack);

        handleEntries(folderMapObj, entries, done);
    });
}

function createDone (folderMapObj, entriesLen, endCallBack) {
    let doneCount = 0;
    
    return function (err) {
        if (err) {
            endCallBack(err, null);
        }

        doneCount++;

        if (doneCount === entriesLen) {
            endCallBack(null, folderMapObj);
        }
    };
}


function handleEntries (folderMapObj, entries, done) {
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
            // TODO: done when 1 file error?
            return done(statErr);
        }

        entryTempObj.stat = entryStat;

        handleEntryStat(folderMapObj, entryTempObj, done);
    });
}


function handleEntryStat (folderMapObj, entryTempObj, done) {
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
        toJson(path, (mapErr, result) => {
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

module.exports = toJson;
