'use strict';

const fs        = require('fs');
const parsePath = require('path').parse;


const handleEntryStat = require('./handle-entry-stat');

const fsStat = fs.stat;

module.exports = function (folderMapObj, entryTempObj, done) {
    const {path, fileName} = entryTempObj;

    const pathObj = parsePath(fileName);

    const {name, ext} = pathObj;

    entryTempObj.name = name;
    entryTempObj.ext  = ext;

    fsStat(path, (statErr, entryStat) => {
        if (statErr) {
            // TODO: done when 1 file error?
            return done(statErr);
        }

        entryTempObj.stat = entryStat;

        handleEntryStat(folderMapObj, entryTempObj, done);
    });
};
