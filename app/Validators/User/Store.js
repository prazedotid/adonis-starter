'use strict'

const BaseValidator = use('App/Validators/Base')

const User = use('App/Models/User')

class Store extends BaseValidator {
  get rules () {
    return {
      ...User.fields
    }
  }
}

module.exports = Store
