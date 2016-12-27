'use strict';

module.exports = function (folderMapObj, maxCount, endCallBack) {
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
};
