'use strict';

const expect = require('chai').expect;

const structure = require('../index');

describe('structure', () => {
    it('is an object', () => {
        expect(structure).to.be.an.object;
        expect(structure.mapToJson).to.be.a.function;
    });
    it('has "mapToJson" API method', () => {
        expect(structure).to.be.an.object;
        expect(structure.mapToJson).to.be.a.function;
    });

    describe('mapToJson', () => {
        it('maps a given folder to a JSON', (done) => {
            const expectedResult = {
                path: './test/map-to-json',
                type: 0,
                entries: {
                    'index.js': {
                        path: 'test\\map-to-json\\index.js',
                        type: 1
                    },
                    a: {
                        path: 'test\\map-to-json\\a',
                        type: 0,
                        entries: {
                            "index.js": {
                                path: 'test\\map-to-json\\a\\index.js',
                                type: 1
                            }
                        }
                    },
                    b: {
                        path: 'test\\map-to-json\\b',
                        type: 0,
                        entries: {
                            "index.js": {
                                path: 'test\\map-to-json\\b\\index.js',
                                type: 1
                            }
                        }
                    }
                }
            };

            structure.mapToJson('./test/map-to-json', (err, result) => {
                expect(result).to.deep.equal(expectedResult);
                done();
            });
        });
    });
});
