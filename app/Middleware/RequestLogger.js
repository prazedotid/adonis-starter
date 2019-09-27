'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Logger = use('Logger')
const chalk = require('chalk')

class RequestLogger {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    const requestStart = process.hrtime()

    response.response.on('finish', () => {
      const [sec, nanosec] = process.hrtime(requestStart)
      const responseTime = (sec * 1e9 + nanosec) / 1000000
      const isError = !response.response.statusCode.toString().startsWith('2')

      if (isError) {
        Logger.info('=> %s %s %s %s',
          chalk.bold.red(response.response.statusCode),
          request.method(),
          chalk.bold(request.url()),
          chalk`{gray [+${responseTime} ms]}`
        )
        Logger.error(response._lazyBody.content.message.text_en)
      } else {
        Logger.info('<= %s %s %s %s',
          chalk.bold.green(response.response.statusCode),
          request.method(),
          chalk.bold(request.url()),
          chalk`{gray [+${responseTime} ms]}`,
        )
      }
    })
    await next()
  }
}

module.exports = RequestLogger
