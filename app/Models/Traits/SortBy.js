'use strict'

/** @typedef {import('@adonisjs/lucid/src/Lucid/QueryBuilder')} QueryBuilder */

class SortBy {
  register (Model) {

    /**
     * Add sortBy method to model query
     * 
     * @param {String} sortStrings
     * 
     * @return {QueryBuilder}
     */
    Model.queryMacro('sortBy', function (sort) {
      let queryBuilder = this
      const sortStrings = sort.split(',')

      for (const sortString of sortStrings) {
        const [sortBy, sortOrder = 'desc'] = sortString.split(':')
        
        queryBuilder = queryBuilder.orderBy(sortBy, sortOrder)
      }

      return queryBuilder
    })

  }
}

module.exports = SortBy
