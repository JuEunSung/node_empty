const winston = require('winston');
require('date-utils');

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.printf((info) => {
        const format = 'YYYY-MM-DD HH24:MI:SS';
        return `${new Date().toFormat(format)} [${info.level.toUpperCase()}] - ${info.message}`;
      }),
    }),
  ],
});

module.exports = logger;
