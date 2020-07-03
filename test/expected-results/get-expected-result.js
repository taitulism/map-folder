const getFullExpectedResult = require('./get-full-expected-result');

const resultMapper = {
	file: res => res.entries['article.doc'],
	folderWithFiles: res => res.entries.diary,
	fullStructure: res => res,
	ignoreItem: res => {
		delete res.entries.notes.entries['wish-list.txt'];
		return res;
	},
	ignoreList: res => {
		delete res.entries.notes.entries.personal;
		delete res.entries.diary.entries['day-2.txt'];
		return res;
	},
	filter: res => {
		delete res.entries.notes.entries['wish-list.txt'];
		delete res.entries.code.entries.images.entries['photo.jpg'];
		delete res.entries.code.entries['index.html'];
		return res;
	},
}

module.exports = function getExpectedResult (testName) {
	const fullExpectedResult = getFullExpectedResult();

	return resultMapper[testName](fullExpectedResult);
};
