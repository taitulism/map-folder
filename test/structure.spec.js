'use strict';

const os          = require('os');
const expect      = require('chai').expect;
const resolvePath = require('path').resolve;

const structure = require('../index');
const platform = os.platform();

const FOLDER = 0;
const FILE   = 1;

const winDefaultMode         = '666';
const LinuxFileDefaultMode   = '644';
const LinuxFolderDefaultMode = '755';

function getDefaultModeByPlatform (platform, entryType = FILE) {
    if (platform === 'win32') return winDefaultMode;

    if (entryType === FILE) return LinuxFileDefaultMode;

    return LinuxFolderDefaultMode;
}

describe('structure', () => {
    it('is an object', () => {
        expect(structure).to.be.an.object;
        expect(structure.mapToJson).to.be.a.function;
    });
    
    it('has a ".toJson()" API method', () => {
        expect(structure).to.be.an.object;
        expect(structure.toJson).to.be.a.function;
    });

    describe('.toJson()', () => {
        it('maps a given folder to a JSON', (done) => {
            const expectedResult = {
                mode: getDefaultModeByPlatform(platform, FOLDER),
                path: resolvePath('./test/to-json'),
                type: 0,
                entries: {
                    'index.js': {
                        mode: getDefaultModeByPlatform(platform, FILE),
                        path: resolvePath('test/to-json/index.js'),
                        type: 1
                    },
                    a: {
                        mode: getDefaultModeByPlatform(platform, FOLDER),
                        path: resolvePath('test/to-json/a'),
                        type: 0,
                        entries: {
                            "index.js": {
                                mode: getDefaultModeByPlatform(platform, FILE),
                                path: resolvePath('test/to-json/a/index.js'),
                                type: 1
                            }
                        }
                    },
                    b: {
                        mode: getDefaultModeByPlatform(platform, FOLDER),
                        path: resolvePath('test/to-json/b'),
                        type: 0,
                        entries: {
                            "index.js": {
                                mode: getDefaultModeByPlatform(platform, FILE),
                                path: resolvePath('test/to-json/b/index.js'),
                                type: 1
                            }
                        }
                    }
                }
            };

            structure.toJson('./test/to-json', (err, result) => {
                expect(result).to.deep.equal(expectedResult);
                done();
            });
        });
    });
});
