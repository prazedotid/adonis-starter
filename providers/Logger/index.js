'use strict'

const os = require('os')
const _ = require('lodash')
const chalk = require('chalk')
const winston = require('winston')
const stripAnsi = require('strip-ansi')

/**
 * Winston console transport driver for @ref('Logger').
 * All the logs will be written to `stdout` or
 * `stderr` based upon the log level.
 *
 * @class WinstonConsole
 * @constructor
 */
class WinstonLogger {
  setConfig (config) {
    /**
     * Merging user config with defaults.
     */

    const consoleFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format.printf(({ level, message, timestamp }) => {
        level = level.padEnd(5, ' ').toUpperCase()

        switch (level) {
          case 'INFO ':
            level = chalk`{green ${level}}`
            break

          case 'ERROR':
            level = chalk`{red ${level}}`
            break

          default:
            level = chalk`{cyan ${level}}`
            break
        }

        if (message && message.startsWith('ALGO: ')) {
          level = chalk`{cyan ALGO} `
          message = message.slice(6)
        }

        return chalk`{gray [${timestamp}]} {bold ${level}} {gray ${os.hostname()}:} ${message}`
      })
    )

    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.splat(),
      winston.format(info => {
        info.message = stripAnsi(info.message)
        return info
      })(),
      winston.format.json()
    )

    /**
     * Creating new instance of winston with file transport
     */
    this.logger = winston.createLogger({
      levels: this.levels,
      transports: [
        new winston.transports.File({
          filename: 'logs/errors.log',
          level: 'error',
          format: fileFormat
        }),
        new winston.transports.File({
          filename: 'logs/debug.log',
          level: 'debug',
          format: fileFormat
        }),
        new winston.transports.Console(Object.assign({}, {
          name: 'adonis-app',
          level: 'info',
          timestamp: new Date().toLocaleTimeString(),
          format: consoleFormat
        }, config))
      ]
    })
  }

  /**
   * A list of available log levels
   *
   * @attribute levels
   *
   * @return {Object}
   */
  get levels () {
    return {
      emerg: 0,
      alert: 1,
      crit: 2,
      error: 3,
      warning: 4,
      notice: 5,
      info: 6,
      debug: 7
    }
  }

  /**
   * Returns the current level for the driver
   *
   * @attribute level
   *
   * @return {String}
   */
  get level () {
    return this.logger.transports[0].level
  }

  /**
   * Update driver log level at runtime
   *
   * @param  {String} level
   *
   * @return {void}
   */
  set level (level) {
    this.logger.transports[0].level = level
  }

  /**
   * Log message for a given level.
   *
   * @method log
   *
   * @param  {Number}    level
   * @param  {String}    msg
   * @param  {...Spread} meta
   *
   * @return {void}
   */
  log (level, msg, ...meta) {
    const levelName = _.findKey(this.levels, (num) => {
      return num === level
    })
    this.logger.log(levelName, msg, ...meta)
  }
}

module.exports = WinstonLogger