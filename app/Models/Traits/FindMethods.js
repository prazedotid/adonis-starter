'use strict'

class FindMethods {
  register (Model) {

    /**
     * Lucid's find method, but returns an empty object instead of null
     * 
     * @param {Object | Number} whereCondition
     * 
     * @return {Object}
     */
    Model.findOrEmptyObj = async (whereCondition = {}) => {
      const query = await Model.find(whereCondition)

      if (query === null) {
        return {}
      }

      return query
    }


    /**
     * Lucid's find method, but returns an empty object instead of null
     * 
     * @param {Object | Number} whereCondition
     * 
     * @return {Object}
     */
    Model.queryMacro('findOrEmptyObj', async function (whereCondition = {}) {
      const query = await this.where(whereCondition).first()

      if (query === null) {
        return {}
      }

      return query
    })

  }
}

module.exports = FindMethods
