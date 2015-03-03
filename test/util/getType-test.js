var expect = require('chai').expect;
var getType = require('../../util/getType');

describe("util/getType()", function() {
    it('detects string', function() {
        expect(getType('test')).to.equal('string');
        expect(getType(String())).to.equal('string');
        expect(getType(new String())).to.equal('string');
    });

    it('detects arguments', function() {
        (function () {
            expect(getType(arguments)).to.equal('arguments');
        })(1, 2);
    });

    it('detects number', function() {
        expect(getType(5)).to.equal('number');
        expect(getType(.5)).to.equal('number');
        expect(getType(new Number(1))).to.equal('number');
        expect(getType(Number(1))).to.equal('number');
    });

    it('detects boolean', function() {
        expect(getType(true)).to.equal('boolean');
        expect(getType(false)).to.equal('boolean');
    });

    it('detects array', function() {
        expect(getType([])).to.equal('array');
        expect(getType(new Array())).to.equal('array');
        expect(getType(Array())).to.equal('array');
    });

    it('detects object', function() {
        expect(getType({})).to.equal('object');
        expect(getType(new Object())).to.equal('object');
        expect(getType(Object())).to.equal('object');
    });

    it('detects function', function() {
        expect(getType(function() {})).to.equal('function');
    });

    it('detects null', function() {
        expect(getType(null)).to.equal('null');
    });

    it('detects undefined', function() {
        expect(getType(undefined)).to.equal('undefined');
        expect(getType()).to.equal('undefined');
    });
});
