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
        
        const folderStatDone = 1;
        const maxCount = entriesLen + folderStatDone;
        const done = createDone(folderMapObj, maxCount, endCallBack);

        fsStat(folderPath, (folderStatErr, folderStat) => {
            if (folderStatErr) {
                return done(folderStatErr, null);
            }

            folderMapObj.mode = getMode(folderStat.mode);

            done(null, null);
        });

        entries.forEach((name) => {
            const entryTempObj = {
                name,
                path: joinPath(folderMapObj.path, name)
            };

            forEachEntry(folderMapObj, entryTempObj, done);
        });
    });
}

function createDone (folderMapObj, maxCount, endCallBack) {
    let doneCount = 0;
    
    return function (err) {
        if (err) {
            endCallBack(err, null);
        }

        doneCount++;

        if (doneCount === maxCount) {
            endCallBack(null, folderMapObj);
        }
    };
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
            type: FILE,
            mode: getMode(stat.mode)
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

function getMode (mode) {
    const mask      = mode & parseInt('777', 8);
    const octalMask = mask.toString(8);

    return octalMask;
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
