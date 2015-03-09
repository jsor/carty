var expect = require('chai').expect;
var type = require('../../lib/util/type');

describe("util/type()", function() {
    it('detects string', function() {
        expect(type('test')).to.equal('string');
        expect(type(String())).to.equal('string');
        expect(type(new String())).to.equal('string');
    });

    it('detects arguments', function() {
        (function () {
            expect(type(arguments)).to.equal('arguments');
        })(1, 2);
    });

    it('detects number', function() {
        expect(type(5)).to.equal('number');
        expect(type(.5)).to.equal('number');
        expect(type(new Number(1))).to.equal('number');
        expect(type(Number(1))).to.equal('number');
    });

    it('detects boolean', function() {
        expect(type(true)).to.equal('boolean');
        expect(type(false)).to.equal('boolean');
    });

    it('detects array', function() {
        expect(type([])).to.equal('array');
        expect(type(new Array())).to.equal('array');
        expect(type(Array())).to.equal('array');
    });

    it('detects object', function() {
        expect(type({})).to.equal('object');
        expect(type(new Object())).to.equal('object');
        expect(type(Object())).to.equal('object');
    });

    it('detects function', function() {
        expect(type(function() {})).to.equal('function');
    });

    it('detects null', function() {
        expect(type(null)).to.equal('null');
    });

    it('detects undefined', function() {
        expect(type(undefined)).to.equal('undefined');
        expect(type()).to.equal('undefined');
    });
});
