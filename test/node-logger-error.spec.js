const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const Raven = require('raven');

process.env.SENTRY_DSN = 'https://1234:1234@sentry.io/4567';
const logger = require('../node-logger.js');

let expect = chai.expect;
chai.use(sinonChai);

describe('Node Logger .error', function() {
    beforeEach(function() {
        sinon.spy(console, 'error');
        sinon.spy(Raven, 'captureException');
        sinon.spy(Raven, 'captureMessage');
    });

    afterEach(function() {
        console.error.restore();
        Raven.captureException.restore();
        Raven.captureMessage.restore();
    });

    describe('when called with error instance', function() {
        it('logs to console with Error', function(done) {
            let testError = new Error('Test Error');
            logger.error('test message', testError);
            expect(console.error).to.be.calledWith('ERROR test message', testError);
            expect(Raven.captureException).to.be.calledWith(testError);
            expect(Raven.captureMessage).not.to.be.called;
            done();
        });
    });

    describe('when called without error instance', function() {
        it('logs to console with Error undefined', function(done) {
            logger.error('test message');
            expect(console.error).to.be.calledWith('ERROR test message', undefined);
            expect(Raven.captureMessage).to.be.calledWith('test message');
            expect(Raven.captureException).not.to.be.called;
            done();
        });
    });

    describe('when called with option.preventRavenCapture', function() {
        it('does to send to Sentry', function(done) {
            logger.error('test message', undefined, {preventRavenCapture: true});
            expect(console.error).to.be.calledWith('ERROR test message', undefined);
            expect(Raven.captureMessage).not.to.be.called;
            expect(Raven.captureException).not.to.be.called;
            done();
        });
    });
});
