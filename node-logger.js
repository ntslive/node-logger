const Sentry = require('@sentry/node');
if (process.env.SENTRY_DSN) {
    Sentry.init({dsn: process.env.SENTRY_DSN});
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
    console.warn(`WARN ${msg}`, ...msgArgs);
};

/**
 * Logs messages as errors to the console, and posts them to Sentry, via Sentry Node SDK (optional)
 *
 * @param msg String - The log message
 * @param error Object - The Error Object
 * @param options Object - valid options include:
 *     -  preventSentryCapture Boolean - if true, the exception is captured with Sentry
 *     -  dataContext Object - extra data to be captured with Sentry
 */
module.exports.error = function(msg, error, options = {}) {
    console.error(`ERROR ${msg}`, error);

    if (process.env.SENTRY_DSN && !options.preventSentryCapture) {
        let sentryOptions = {};
        // keep checking for options.dataContext to keep compatible with older versios
        sentryOptions.extra = options.dataContext || options.extra || {};
        if (options.fingerprint) { sentryOptions.fingerprint = options.fingerprint; }
        if (options.level) { sentryOptions.level = options.level; }
        if (options.req) { sentryOptions.req = options.req; }
        if (options.tags) { sentryOptions.tags = options.tags; }
        if (options.user) { sentryOptions.user = options.user; }

        if (error instanceof Error) {
            sentryOptions.extra.errorMessage = msg;
            Sentry.captureException(error, sentryOptions, sentryCallback);
        } else {
            Sentry.captureMessage(msg, sentryOptions, sentryCallback);
        }
    }
};
