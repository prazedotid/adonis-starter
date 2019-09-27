'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class HelpersProvider extends ServiceProvider {

  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Adonis/Addons/Helpers', () => {
      return new (require('.'))
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

    Logger.registerProvider('Helpers')
  }

}

module.exports = HelpersProvider