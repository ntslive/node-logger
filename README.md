# NTS Logger

[ ![Codeship Status for ntslive/node-logger](https://app.codeship.com/projects/c1815250-0e5c-0135-a3ef-6a14b39ec87c/status?branch=master)](https://app.codeship.com/projects/215949)

Logger used by NTS in their Node applications.
Captures errors with Raven.

## Installation

Include as dependency in `package.json`:

`"node-logger": "ntslive/node-logger#0.0.2",`

Note that this requires the Git tag `0.0.2` to be present.

Then run `npm install` as usual.

## Usage

```Javascript
const logger = require('node-logger');
logger.error(errorMessage, errorInstance, { dataContext: dataObject });
```

## Testing

Run `npm test`

To run eslint with `fix` flag, run `bin/eslint`
