'use strict'

const Logger = use('Logger')
const chalk = require('chalk')
const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { response }) {
    let data = {}
    let message = 'generic.internalServerError'
    let messageArg = false
    switch (error.code) {
      case 'E_ROUTE_NOT_FOUND':
        error.status = 404
        message = 'generic.notFound'
        break
      case 'ER_DUP_ENTRY':
        error.status = 409
        message = 'generic.conflict'
        data = { error: 'E_DATA_ALREADY_EXISTS'}
        break
      case 'E_INVALID_MODEL_RELATION':
        error.status = 422
        message = 'generic.invalidModelRelation'
        break

      default:
        data = { error: error.message }
        break
    }

    response.sendError(data, [message, messageArg], error.status)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    Logger.info('=> %s %s %s',
      chalk.bold.red(error.status),
      request.method(),
      chalk.bold(request.url())
    )

    Logger.error('%s\n%s', error.message, error.stack)
  }
}

module.exports = ExceptionHandler
