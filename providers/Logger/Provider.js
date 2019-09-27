'use strict'

const chalk = require('chalk')
const { ServiceProvider } = require('@adonisjs/fold')

class LoggerProvider extends ServiceProvider {

  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.extend('Adonis/Src/Logger', 'winston', () => {
      return require('.')
    })
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Logger = use('Logger')
    Logger._loggerInstances.custom.__proto__.registerProvider = providerName => Logger.debug(chalk`{cyan Provider Registered}: ${providerName}`)

    Logger.registerProvider('Logger')
  }

}

module.exports = LoggerProvider
