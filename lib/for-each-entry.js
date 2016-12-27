'use strict';

const fs = require('fs');

const handleEntryStat = require('./handle-entry-stat');

const fsStat = fs.stat;

module.exports = function (folderMapObj, entryTempObj, done) {
    const path = entryTempObj.path;

    fsStat(path, (statErr, entryStat) => {
        if (statErr) {
            // TODO: done when 1 file error?
            return done(statErr);
        }

        entryTempObj.stat = entryStat;

        handleEntryStat(folderMapObj, entryTempObj, done);
    });
};
