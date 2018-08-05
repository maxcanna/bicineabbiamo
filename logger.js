const winston = require('winston');
const { env: { LOGENTRIES_TOKEN: logentriesToken, NODE_ENV: environment = 'production' } } = process;
const development = environment === 'development';
const test = environment === 'test';
const logger = new winston.Logger();
require('le_node');

if (!development && !test && logentriesToken) {
    winston.exitOnError = false;
    logger.add(winston.transports.Logentries, { token: logentriesToken, withStack: true, secure: true });
} else if (!test) {
    logger.add(winston.transports.Console, {}, false);
}

logger.write = logger.info;

module.exports = logger;
