'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

const moment = require('moment')

class ValidatorProvider extends ServiceProvider {

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const Logger = use('Logger')
    const Database = use('Database')
    const Validator = use('Validator')

    const timeFormatFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        return
      }

      const [format] = args
      if (!moment(value, format, true).isValid()) {
        throw message
      }
    }

    const existsFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        return
      }
    
      const [table, column] = args
      const row = await Database.table(table).where(column, value).first()
    
      if (!row) {
        throw message
      }
    }

    const uniqueFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        return
      }
    
      const [table, column] = args
      const row = await Database.table(table).where(column, value).whereNull('deleted_at').first()
    
      if (row) {
        throw message
      }
    }

    const includesOneOfFn = async (data, field, message, args, get) => {
      const value = get(data, field)
      if (!value) {
        return
      }
    
      if (!args.some(item => value.includes(item))) {
        throw message
      }
    }
    
    Validator.extend('exists', existsFn)
    Validator.extend('unique', uniqueFn)
    Validator.extend('includesOneOf', includesOneOfFn)
    Validator.extend('timeFormat', timeFormatFn)
    Validator.sanitizor.lowerCase = value => value.toLowerCase()
    Validator.sanitizor.upperCase = value => value.toUpperCase()

    Logger.registerProvider('Validator')
  }

}

module.exports = ValidatorProvider
