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
            size: 24,
            type: 0,
            len: 3,
            entries: {
                'index.js': {
                    mode: getDefaultModeByPlatform(FILE),
                    path: resolvePath('test/map-folder/index.js'),
                    size: 10,
                    type: 1,
                    name: 'index',
                    ext: 'js'
                },
                a: {
                    mode: getDefaultModeByPlatform(FOLDER),
                    path: resolvePath('test/map-folder/a'),
                    size: 7,
                    type: 0,
                    len: 1,
                    entries: {
                        'index.js': {
                            mode: getDefaultModeByPlatform(FILE),
                            path: resolvePath('test/map-folder/a/index.js'),
                            size: 7,
                            type: 1,
                            name: 'index',
                            ext: 'js'
                        }
                    }
                },
                b: {
                    mode: getDefaultModeByPlatform(FOLDER),
                    path: resolvePath('test/map-folder/b'),
                    size: 7,
                    type: 0,
                    len: 1,
                    entries: {
                        'index.js': {
                            mode: getDefaultModeByPlatform(FILE),
                            path: resolvePath('test/map-folder/b/index.js'),
                            size: 7,
                            type: 1,
                            name: 'index',
                            ext: 'js'
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
