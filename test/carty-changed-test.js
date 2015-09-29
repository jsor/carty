var assert = require('chai').assert;
var sinon = require('sinon');
var carty = typeof window !== 'undefined' ? window.carty : require('../lib/carty');

describe("carty().changed()", function() {
    var cart;

    beforeEach(function() {
        cart = carty();
    });

    it("emits changed event", function(done) {
        cart = carty();

        var spy = sinon.spy();

        cart.on('changed', spy);

        cart
            .changed()
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });

    it("emits changed event in ready()", function(done) {
        cart = carty();

        var spy = sinon.spy();

        cart.on('changed', spy);

        cart
            .ready(function() {
                cart.changed();
            })
            .ready(function() {
                assert.isTrue(spy.called);
                done();
            })
        ;
    });
});
