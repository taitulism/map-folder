const expect = require('chai').expect;

const structure = require('../index');

describe('structure', () => {
    it('is', () => {
        const myModule = structure();

        expect(myModule);
    });
});
