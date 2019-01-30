const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const Sentry = require('@sentry/node');

process.env.SENTRY_DSN = 'https://1234:1234@sentry.io/4567';
const logger = require('../node-logger.js');

let expect = chai.expect;
chai.use(sinonChai);

describe('Node Logger .error', function() {
    beforeEach(function() {
        sinon.spy(console, 'error');
        sinon.spy(Sentry, 'captureException');
        sinon.spy(Sentry, 'captureMessage');
    });

    afterEach(function() {
        console.error.restore();
        Sentry.captureException.restore();
        Sentry.captureMessage.restore();
    });

    describe('when called with error instance', function() {
        it('logs to console with Error', function(done) {
            let testError = new Error('Test Error');
            logger.error('test message', testError);
            expect(console.error).to.be.calledWith('ERROR test message', testError);
            expect(Sentry.captureException).to.be.calledWith(testError);
            expect(Sentry.captureMessage).not.to.be.called;
            done();
        });
    });

    describe('when called without error instance', function() {
        it('logs to console with Error undefined', function(done) {
            logger.error('test message');
            expect(console.error).to.be.calledWith('ERROR test message', undefined);
            expect(Sentry.captureMessage).to.be.calledWith('test message');
            expect(Sentry.captureException).not.to.be.called;
            done();
        });
    });

    describe('when called with option.preventSentryCapture', function() {
        it('does to send to Sentry', function(done) {
            logger.error('test message', undefined, {preventSentryCapture: true});
            expect(console.error).to.be.calledWith('ERROR test message', undefined);
            expect(Sentry.captureMessage).not.to.be.called;
            expect(Sentry.captureException).not.to.be.called;
            done();
        });
    });
});
