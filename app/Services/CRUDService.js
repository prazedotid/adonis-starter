'use strict'

/** @typedef {import('@adonisjs/lucid/src/Lucid/QueryBuilder')} QueryBuilder */
/** @typedef {import('@adonisjs/lucid/src/Lucid/Serializers/Vanilla')} VanillaSerializer */
/** @typedef {import('../Models/Base')} Model */

const _ = require('lodash')

const Helpers = use('Adonis/Addons/Helpers')
const Env = use('Env')
const like = Env.get('DB_CONNECTION') == 'pg' ? 'ILIKE' : 'LIKE'

/**
 * Service with CRUD functions
 * @class
 */
class CRUDService {
  /**
   * Pass model name to construct CRUD Service
   *
   * @param {string} modelName
   */
  constructor (modelName) {
    /** @type {import('../Models/Base')} */
    this.model = use('App/Models/' + modelName)
  }

  /**
   * Return model fields
   *
   * @return {String[]} - Array of model fields
   */
  fields () {
    return Object.keys(this.model.fields)
  }

  /**
   * Return model query builder
   *
   * @return {QueryBuilder} - Adonis Query Builder
   */
  query () {
    return this.model.query()
  }

  /**
   * Return model relations
   *
   * @return {String[]} - Array of model relations
   */
  relations () {
    const relations = {}
    const exceptions = ['constructor', 'delete', 'restore', 'isDeleted', 'isTrashed', 'wasTrashed']
    const keys = _(Object.getOwnPropertyNames(this.model.prototype)).difference(exceptions).filter(x => !(x.startsWith('get') || x.startsWith('set'))).value()

    for (const key of keys) {
      relations[key] = this.model.prototype[key].toString().match(/'App\/Models\/.+?(?=')'/)[0]
    }

    return relations
  }

  /**
   * Get all instances of model
   *
   * @param {Object} params
   * @param {Number} params.page - Selects pagination page. Only effective when pagination is used.
   * @param {Number} params.limit - Selects pagination row per page. Only effective when pagination is used.
   * @param {String} params.sort - What column to use to sort the result. Format is (column_name):(asc/desc)
   * @param {Object} params.search - Search for substring in a column.
   * @param {Object | Function} params.where - Where condition for querying.
   * @param {String | Array<String | Function>} params.whereHas - Only include rows that has the specified relation.
   * @param {String | Array<String | Function>} params.has - Only include rows that has the specified relation.
   * @param {String | Array<String | Function>} params.include - Include specified relations.
   * @param {Boolean} params.json - Immediately converts result to JSON. Disables pagination if true. Defaults to false.
   * @param {Boolean} params.paginate - Use pagination. Defaults to true.
   *
   * @return {Promise<VanillaSerializer> | Promise<Object[]>}
   */
  async findAll ({
    page = 1,
    limit = 5,
    sort = `${this.model.primaryKey}:desc`,
    search,
    where,
    whereHas,
    has,
    include,
    json = false,
    paginate = true
  } = {}) {
    /** @type {QueryBuilder} */
    let queryBuilder = this.model.query().sortBy(sort)

    if (Helpers.isString(has)) {
      queryBuilder = queryBuilder.has(has)
    } else if (Helpers.isArray(has)) {
      for (const item of has) {
        queryBuilder = queryBuilder.has(item)
      }
    }

    if (Helpers.isString(include)) {
      queryBuilder = queryBuilder.with(include)
    } else if (Helpers.isArray(include)) {
      for (const item of include) {
        queryBuilder = Helpers.isArray(item)
          ? queryBuilder.with(item[0], item[1])
          : queryBuilder.with(item)
      }
    }

    if (Helpers.isString(whereHas)) {
      queryBuilder = queryBuilder.whereHas(whereHas)
    } else if (Helpers.isArray(whereHas)) {
      for (const item of whereHas) {
        queryBuilder = Helpers.isArray(item)
          ? queryBuilder.whereHas(item[0], item[1], item[2], item[3])
          : queryBuilder.whereHas(item)
      }
    }

    if (where) {
      queryBuilder = queryBuilder.where(where)
    }

    if (Helpers.isObject(search)) {
      queryBuilder = queryBuilder.where(builder => {
        for (const [key, value] of Object.entries(search)) {
          builder = builder.orWhere(key, like, `%${value}%`)
        }
      })
    }

    if (paginate && !json) {
      return queryBuilder.paginate(page, limit)
    } else {
      return json
        ? (await queryBuilder.fetch()).toJSON()
        : queryBuilder.fetch()
    }
  }

  /**
   * Find row with condition
   * @param {Object} params
   * @param {Object | Function} params.where - Where condition for querying.
   * @param {String | Array<String | Function>} params.include - Include specified relations.
   * @param {Boolean} params.emptyObj - Option whether to return an empty object instead of null if no row is found. Defaults to true.
   * @param {Boolean} params.json - Option whether to immediately convert result to json. Defaults to false.
   *
   * @return {Promise<VanillaSerializer | Object>}
   */
  async find ({
    where,
    include,
    emptyObj = true,
    json = false
  } = {}) {
    /** @type {QueryBuilder} */
    let queryBuilder = this.model.query().where(where)

    if (Helpers.isString(include)) {
      queryBuilder = queryBuilder.with(include)
    } else if (Helpers.isArray(include)) {
      for (const item of include) {
        queryBuilder = Helpers.isArray(item)
          ? queryBuilder.with(item[0], item[1])
          : queryBuilder.with(item)
      }
    }

    let result = await queryBuilder.first()

    return result === null
      ? emptyObj
        ? {}
        : null
      : json
        ? result.toJSON()
        : result
  }

  /**
   * Create instance of model
   *
   * @param {Object} data - Data to be inserted
   * @return {Model}
   */
  create (data) {
    return this.model.create(data)
  }

  /**
   * Bulk create instance of model
   *
   * @param {Object[]} data - Data to be inserted
   * @return {Model[]}
   */
  createMany (data) {
    return this.model.createMany(data)
  }

  /**
   * Automatically fill fields with data.
   *
   * @param {Object} data - Data to fill the fields with
   * @param {String[]} fields - Fields to be filled. Defaults to the model's fields
   * @return {Object}
   */
  fillFields (data, fields = this.fields()) {
    const filledObj = {}

    for (const field of fields) {
      filledObj[field] = data[field]
    }

    return filledObj
  }
}

module.exports = CRUDService
