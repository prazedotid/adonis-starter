'use strict'

const pluralize = require('pluralize')
const changeCase = require('change-case')
const { ServiceProvider } = require('@adonisjs/fold')

class RouteProvider extends ServiceProvider {

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Route = use('Route')
    const Logger = use('Logger')

    Route.__proto__.apiResource = routeName => {
      let singularName = pluralize.singular(routeName)
      singularName = changeCase.pascalCase(singularName)

      return Route.resource(routeName, `${singularName}Controller`)
        .apiOnly()
        .middleware('auth')
        .validator(new Map([
          [[`${routeName}.index`], [`${singularName}/List`]],
          [[`${routeName}.store`], [`${singularName}/Store`]],
          [[`${routeName}.update`], [`${singularName}/Update`]]
        ]))
    }

    Logger.registerProvider('Route')
  }
  
}

module.exports = RouteProvider
