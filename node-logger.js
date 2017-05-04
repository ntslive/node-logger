const Raven = require('raven');
if (process.env.SENTRY_DSN) {
    Raven.config(process.env.SENTRY_DSN).install();
}

let sentryCallback = function(sendErr, eventId) {
    if (sendErr) {
        console.error('ERROR Failed to send captured exception to Sentry');
    }
};

module.exports.debug = function(msg, ...msgArgs) {
    if (process.env.LOG_LEVEL == 'debug') {
        console.log(`DEBUG ${msg}`, ...msgArgs);
    }
};

module.exports.info = function(msg, ...msgArgs) {
    console.log(`INFO ${msg}`, ...msgArgs);
};

module.exports.warn = function(msg, ...msgArgs) {
    console.warn(`WANR ${msg}`, ...msgArgs);
};

/**
 * This is reused site-wide. Returns a list of episodes.
 *
 * @param msg String - The log message
 * @param error Object - The Error Object
 * @param options Object - valid options include:
 *     -  preventRavenCapture Boolean - if true, the exception is captured with Raven
 *     -  dataContext Object - extra data to be captured with Raven
 */
module.exports.error = function(msg, error, options = {}) {
    console.error(`ERROR ${msg}`, error);

    if (process.env.SENTRY_DSN && !options.preventRavenCapture) {
        let extraData = (options.dataContext) ? options.dataContext : {};

        if (error instanceof Error) {
            extraData.errorMessage = msg;
            Raven.captureException(error, { extra: extraData }, sentryCallback);
        } else {
            Raven.captureMessage(msg, { extra: extraData }, sentryCallback);
        }
    }
};
