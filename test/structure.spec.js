'use strict';

const expect = require('chai').expect;

const structure = require('../index');

describe('structure', () => {
    it('is an object with API methods', () => {
        expect(structure).to.be.an.object;
        expect(structure.mapToJson).to.be.a.function;
    });
});
