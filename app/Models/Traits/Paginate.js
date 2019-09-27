'use strict'

const _ = require('lodash')
const excludeAttrFromCount = ['order', 'columns', 'limit', 'offset']

class Paginate {
  register (Model) {

    /**
     * Patch default QueryBuilder paginate method
     * 
     * @param {Number} page
     * @param {Number} limit
     * 
     * @return {Object} @multiple([result=Array, total_data=Number, current_page=Number, last_page=Number, per_page=Number, total_page=Numbercd])
     */
    Model.queryMacro('paginate', async function (page, limit) {
      const countByQuery = this.clone().where('deleted_at', null)
    
      /**
       * Force cast page and limit to numbers
       */
      page = Number(page)
      limit = Number(limit)
    
      /**
       * Remove statements that will make things bad with count
       * query, for example `orderBy`
       */
      countByQuery._statements = _.filter(countByQuery._statements, (statement) => {
        return excludeAttrFromCount.indexOf(statement.grouping) < 0
      })
    
      const showAll = limit === -1
      const counts = await countByQuery.count('* as total')
      const total = _.get(counts, '0.total', 0)
      let data = []
      
      if (total > 0) {
        data = showAll
          ? await this.where('deleted_at', null).fetch()
          : await this.forPage(page, limit).where('deleted_at', null).fetch()
      }

      const totalPage = showAll ? 1 : Math.ceil(total / limit)
    
      return {
        result: data,
        total_data: total,
        pagination: {
          current_page: page,
          last_page: totalPage,
          per_page: showAll ? total : limit,
          total_page: totalPage
        }
      }
    })

  }
}

module.exports = Paginate
