const OCTAL_BASE = 8;

module.exports = function getOctalMode (mode) {
	// eslint-disable-next-line no-bitwise
	const mask = mode & parseInt('777', OCTAL_BASE);
	const octalMask = mask.toString(OCTAL_BASE);

	// eslint-disable-next-line prefer-template
	return '0' + octalMask;
};
