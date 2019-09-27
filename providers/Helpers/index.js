'use strict'

const _ = require('lodash')

/**
 * Helpers class
 */
class Helpers {
  /**
   * Checks whether if the passed value is an object or not
   * 
   * @param {any} val - Value to be checked
   * @return {Boolean} Whether the value is a valid object or not
   */
  isObject (val) {
    return Object.prototype.toString.call(val) === '[object Object]'
  }

  /**
   * Checks whether if the passed value is an empty object or not
   * 
   * @param {any} val - Value to be checked
   * @return {Boolean} Whether the value is an empty object or not
   */
  isEmptyObject (val) {
    return Object.keys(val).length === 0
  }

  /**
   * Checks whether if the passed value is an array or not
   * 
   * @param {any} val - Value to be checked
   * @return {Boolean} Whether the value is an array or not
   */
  isArray (val) {
    return Array.isArray(val)
  }

  /**
   * Checks whether if the passed value is a string or not
   * 
   * @param {any} val - Value to be checked
   * @return {Boolean} Whether the value is a string or not
   */
  isString (val) {
    return typeof val === 'string' || val instanceof String
  }

  /**
   * Returns an empty object if value is null
   * 
   * @param {any} val - Value to be checked
   * @return {any} Return the value if it's not null, return an empty object otherwise
   */
  emptyObjIfNull (val) {
    return val === null ? {} : val
  }

  /**
   * Sort object by its keys
   * 
   * @param {Object} o - Object to be sorted
   * @return {Object} Object with sorted keys
   */
  sortObject (o) {
    return Object.keys(o).sort().reduce((r, k) => {
      r[k] = o[k]
      return r
    }, {})
  }

  /**
   * Omit auto-generated database columns from data
   * 
   * @param {Object} data - Data to be filtered
   * @return {Object} Data with filtered keys
   */
  stripInsertData (data) {
    return _.omit(data, ['id', 'created_at', 'updated_at', 'deleted_at'])
  }
}

module.exports = Helpers