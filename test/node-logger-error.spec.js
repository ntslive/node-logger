const chai = require('chai');
const sinonChai = require('sinon-chai');
const sinon = require('sinon');
const Raven = require('raven');

const logger = require('../node-logger.js');

let expect = chai.expect;
chai.use(sinonChai);

describe('Node Logger .error', function() {
    beforeEach(function() {
        sinon.spy(console, 'error');
    });

    afterEach(function() {
        console.error.restore();
    });

    describe('when called with error instance', function() {

        it('logs to console with Error', function() {
            let testError = new Error('Test Error');
            logger.error('test message', testError);
            expect(console.error).to.be.calledWith('ERROR test message', testError);
        });
    });

    describe('when called without error instance', function() {
        it('logs to console with Error undefined', function() {
            logger.error('test message');
            expect(console.error).to.be.calledWith('ERROR test message', undefined);
        });
    });
});
