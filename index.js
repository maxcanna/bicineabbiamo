require('newrelic');
const express = require('express');
const api = require('./routes_api');
const assistant = require('./routes_assistant');
const logger = require('./logger');
const Rollbar = require('rollbar');
const morgan = require('morgan');
const { env: { PORT: port = 3000, ROLLBAR_KEY, NODE_ENV } } = process;
const environment = NODE_ENV || 'production';
const development = environment === 'development';
const rollbar = new Rollbar({
    accessToken: ROLLBAR_KEY,
    environment,
    captureUncaught: !development,
    captureUnhandledRejections: !development,
});
const app = express();

app.use(require('compression')());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use('/api', api);
app.use('/assistant', assistant);
app.use(express.static(__dirname + '/public'));
app.use(rollbar.errorHandler());
app.disable('x-powered-by');
app.enable('trust proxy');

app.listen(port, () => logger.info(`bicineabbiamo listening on port ${port}`));
