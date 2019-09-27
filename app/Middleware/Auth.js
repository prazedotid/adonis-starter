'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const Redis = use('Redis')

class Auth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Function} next
   */
  async handle ({ auth, request, response }, next) {
    let messageKey = 'auth.tokenNotFound'
    const token = request.headers().authorization
      ? request.headers().authorization.slice(7)
      : false

    if (token) {
      const getToken = JSON.parse(await Redis.get('tokens') || '{}')
      const tokenInstance = auth.authenticatorInstance.jwtPayload
        ? getToken[auth.authenticatorInstance.jwtPayload.uid]
        : false

      if (tokenInstance && tokenInstance === token) {
        return next()
      }

      messageKey = 'auth.tokenExpired'
    }

    return response.sendError({}, [messageKey, false], 401)
  }
}

module.exports = Auth
