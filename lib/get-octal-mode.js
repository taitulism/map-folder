'use strict';

const OCTAL_BASE = 8;

module.exports = function (mode) {
    const mask      = mode & parseInt('777', OCTAL_BASE);
    const octalMask = mask.toString(OCTAL_BASE);

    // eslint-disable-next-line prefer-template
    return '0' + octalMask;
};
