'use strict'

const BaseValidator = require('.')

class BaseList extends BaseValidator {
  get paginationRules() {
    return {
      page: 'number',
      limit: 'number'
    }
  }

  get rules () {
    return this.paginationRules
  }
}

module.exports = BaseList
