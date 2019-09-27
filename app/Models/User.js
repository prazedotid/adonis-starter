'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const BaseModel = use('App/Models/Base')

class User extends BaseModel {
  static get table () {
    return 'users'
  }

  static get fields () {
    return {
      full_name: 'required|string',
      username: 'required|string',
      email: 'required|email',
      password: 'required|string',
    }
  }
}

module.exports = User
