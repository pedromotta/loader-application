var winston = require('winston');

var formatter = function(options) {
  var message = (options.message ? options.message : options.meta);

  var template = `{LOADER-APPLICATION} - ${options.timestamp.toISOString()} - [${options.level.toUpperCase()}] - ${message}`;

  return winston.config.colorize(options.level, template);
};

var logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      level: 'debug',
      timestamp: new Date(),
      formatter: formatter
    }),
    new winston.transports.File({
      filename: 'log/loader_application_logs.log',
      maxsize: '10000000'
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'log/loader_application_exceptions.log',
      maxsize: '10000000'
    })
  ],
  exitOnError: false
});

logger.stream = {
  write: function(message) {
    logger.info(message);
  }
};

module.exports = logger;
