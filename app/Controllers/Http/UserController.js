'use strict'

/** @type {import('../../Services/CRUDService')} */
const BasicController = use('App/Controllers/Http/BasicController')

class UserController extends BasicController {
  constructor() {
    super('User')
  }
}

module.exports = UserController
