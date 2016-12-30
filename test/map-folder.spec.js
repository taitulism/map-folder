'use strict';

const os          = require('os');
const expect      = require('chai').expect;
const resolvePath = require('path').resolve;

const mapFolder = require('../index');
const platform = os.platform();

const FOLDER = 0;
const FILE   = 1;

const winDefaultMode         = '0666';
const LinuxFileDefaultMode   = '0644';
const LinuxFolderDefaultMode = '0755';

function getDefaultModeByPlatform (entryType = FILE) {
    if (platform === 'win32') return winDefaultMode;

    if (entryType === FILE) return LinuxFileDefaultMode;

    return LinuxFolderDefaultMode;
}

describe('mapFolder', () => {
    it('is a function', () => {
        expect(mapFolder).to.be.a.function;
    });

    it('maps a given folder to a JSON', (done) => {
        const expectedResult = {
            mode: getDefaultModeByPlatform(FOLDER),
            path: resolvePath('./test/map-folder'),
            type: 0,
            entries: {
                'index.js': {
                    mode: getDefaultModeByPlatform(FILE),
                    path: resolvePath('test/map-folder/index.js'),
                    type: 1
                },
                a: {
                    mode: getDefaultModeByPlatform(FOLDER),
                    path: resolvePath('test/map-folder/a'),
                    type: 0,
                    entries: {
                        'index.js': {
                            mode: getDefaultModeByPlatform(FILE),
                            path: resolvePath('test/map-folder/a/index.js'),
                            type: 1
                        }
                    }
                },
                b: {
                    mode: getDefaultModeByPlatform(FOLDER),
                    path: resolvePath('test/map-folder/b'),
                    type: 0,
                    entries: {
                        'index.js': {
                            mode: getDefaultModeByPlatform(FILE),
                            path: resolvePath('test/map-folder/b/index.js'),
                            type: 1
                        }
                    }
                }
            }
        };

        mapFolder('./test/map-folder', (err, result) => {
            if (err) throw err;
            
            expect(result).to.deep.equal(expectedResult);
            done();
        });
    });
});
