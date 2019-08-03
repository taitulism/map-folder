module.exports = function createDone (folderMapObj, maxCount, endCallBack) {
	let doneCount = 0;

	return function done (err) {
		if (err) {
			endCallBack(err, null);
		}

		doneCount++;

		if (doneCount === maxCount) {
			endCallBack(null, folderMapObj);
		}
	};
};
