'use strict';

const expect = require('chai').expect;
const resolvePath = require('path').resolve;

const structure = require('../index');

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
                path: resolvePath('./test/to-json'),
                type: 0,
                entries: {
                    'index.js': {
                        path: resolvePath('test/to-json/index.js'),
                        type: 1
                    },
                    a: {
                        path: resolvePath('test/to-json/a'),
                        type: 0,
                        entries: {
                            "index.js": {
                                path: resolvePath('test/to-json/a/index.js'),
                                type: 1
                            }
                        }
                    },
                    b: {
                        path: resolvePath('test/to-json/b'),
                        type: 0,
                        entries: {
                            "index.js": {
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
