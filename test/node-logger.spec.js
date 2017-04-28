var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    logger = require('../node-logger.js');

chai.use(sinonChai);

describe('Node Logger', function() {
    describe('.debug', function() {
        beforeEach(function() {
            sinon.spy(console, 'log');
        });

        afterEach(function() {
            console.log.restore();
        });

        describe('when LOG_LEVEL is debug', function() {
            var originalLOG_LEVEL;
            before(function() {
                originalLOG_LEVEL = process.env.LOG_LEVEL;
                process.env.LOG_LEVEL = 'debug';
            });
            after(function() {
                process.env.LOG_LEVEL = originalLOG_LEVEL;
            });

            it('logs to console', function() {
                logger.debug('TEST');
                expect(console.log).to.be.called;
            });
        });

        describe('when no LOG_LEVEL is set', function() {
            it('does not log to console', function() {
                logger.debug('TEST');
                expect(console.log).not.to.be.called;
            });
        });
    });
});
