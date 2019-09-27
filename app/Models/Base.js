'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseModel extends Model {
  static _bootIfNotBooted () {
    if (this.name !== 'BaseModel') {
      super._bootIfNotBooted()
      if (!this.$globalScopes.scopes.find(scope => scope.name === 'soft_deletes') && this.softDelete ) {
        this.addTrait('@provider:Lucid/SoftDeletes')
      }
    }

    this.addTrait('SortBy')
    this.addTrait('Paginate')
    this.addTrait('FindMethods')
  }

  static get fields () {
    return {}
  }

  static get softDelete () {
    return true
  }

  static get dates () {
    return super.dates.concat(['deleted_at'])
  }
}

module.exports = BaseModel
