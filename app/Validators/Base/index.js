'use strict'

const { camelCase } = require('change-case')

class BaseValidator {
  get validateAll () {
    return true
  }

  async fails (errorMessages) {
    errorMessages = errorMessages.map(message => {
      console.error('validationError', message)

      const field = message.field.replace(/\.[0-9]/, '.*')
      let ruleHasExpectedValues = null
      
      if (typeof this.rules[field] === 'string') {
        ruleHasExpectedValues = this.rules[field].split('|')
          .map(item => {
            const split = item.split(':')

            return split.length > 1
              ? `${camelCase(split[0])}:${split[1]}`
              : split[0]
          })
          .find(item => item.startsWith(message.validation)).split(':')[1]
        message.expectedValues = ruleHasExpectedValues.split(',').join(', ')
      } else {
        ruleHasExpectedValues = this.rules[field].find(rules => rules.name === message.validation).args
        message.expectedValues = ruleHasExpectedValues[0]
      }

      message.value = this.ctx.request.all()[field]
      message.field = field

      return message
    })

    return this.ctx.response.sendValidationError(errorMessages)
  }

  removeRequiredRules (model) {
    return Object
      .entries(model.fields)
      .map(([key, rule]) => {
        let cleanedRule = typeof rule === 'string'
          ? rule.replace(/required\|?/, '').replace(/unique.*?(\||$)/g, '').replace(/^\|+|\|+$/g, '')
          : rule.filter(r => r.name !== 'required' || r.name !== 'unique')
          
        return { [key]: cleanedRule }
      })
      .reduce(((r, c) => Object.assign(r, c)), {})
  }

  generateNestedRules (model, prefix) {
    return Object
      .entries(model.fields)
      .map(([key, rule]) => ({ [prefix + '.' + key]: rule }))
      .reduce(((r, c) => Object.assign(r, c)), {})
  }

  generateNestedRequiredWhen (model, field, value) {
    return Object
      .entries(model.fields)
      .map(([key, rule]) => {
        let generatedRule = typeof rule === 'string'
          ? rule.replace(/required/, `requiredWhen:${field},${value}`)
          : rule.map(r => {
            if (r.name === 'required') {
              r.name = 'requiredWhen'
              r.args = [field, value]
            }

            return r
          })

        return { [value + '.' + key]: generatedRule }
      })
      .reduce(((r, c) => Object.assign(r, c)), {})
  }

  removeNestedRequiredRules (model, value) {
    return Object
      .entries(model.fields)
      .map(([key, rule]) => {
        let cleanedRule = typeof rule === 'string'
          ? rule.replace(/required\|?/, '')
          : rule.filter(r => r.name !== 'required')
        
        return { [value + '.' + key]: cleanedRule }
      })
      .reduce(((r, c) => Object.assign(r, c)), {})
  }
}

module.exports = BaseValidator