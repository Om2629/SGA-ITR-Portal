/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * https://sailsjs.com/docs/concepts/logging
 */

const arg = require('minimist')(process.argv.slice(2));
const logLevel = arg['logLevel'];

const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  transports: [
    new transports.File({
      name: 'all-logs',
      filename: 'logs/logs.log'
    }),
    new transports.File({
      name: 'error-file',
      filename: 'logs/error.log',
      level: 'error'
    }),

    new transports.Console({
      level: logLevel,
      format: format.combine(
        format.label({ label: '[itr-portal-rest-service]' }),
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DDTHH:mm:ss.sssz'
        }),
        format.printf(info => `${info.timestamp} - ${info.level}: ${info.label}${info.message}`),
        format.align()
      )
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ]
});

module.exports.log = {
  custom: logger,
  level: logLevel,
  prefix: ' '
};
