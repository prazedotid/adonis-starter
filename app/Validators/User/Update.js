'use strict'

const BaseValidator = use('App/Validators/Base')

const User = use('App/Models/User')

class Update extends BaseValidator {
  get rules () {
    return {
      ...(this.removeRequiredRules(User))
    }
  }
}

module.exports = Update
