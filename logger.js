const winston = require('winston');
const { env: { NODE_ENV: environment = 'development' } } = process;
const test = environment === 'test';
const logger = winston.createLogger({ exitOnError: false });

logger.add(new winston.transports.Console({ format: winston.format.simple(), silent: test } ));

module.exports = logger;
