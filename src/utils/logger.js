'use strict'

import winston from 'winston'
winston.emitErrs = true

const transports = []
transports.push(new winston.transports.File({
  level: 'info',
  filename: process.cwd() + '/logs/app-logs.log',
  timestamp: true,
  handleExceptions: true,
  json: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  colorize: false
}))

if (process.env.NODE_ENV !== 'test') {
  transports.push(new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  }))
}

const logger = new winston.Logger({
  transports: transports,
  exitOnError: false
})

module.exports = logger
module.exports.stream = {
  write: function (message, encoding) {
    logger.info(message)
  }
}
