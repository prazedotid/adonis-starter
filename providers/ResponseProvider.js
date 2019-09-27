'use strict'

const http = require('http')

/** @type {typeof import('@adonisjs/fold/src/Ioc')} */
const { ServiceProvider } = require('@adonisjs/fold')

class ResponseProvider extends ServiceProvider {

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    const self = this
    const Logger = use('Logger')
    const Response = use('Adonis/Src/Response')
    
    Response.macro('ok', function (data = {}, message = undefined, code = 200) {
      const responseObject = {
        code,
        status: http.STATUS_CODES[code],
        message: self.getMessage(message, { text_en: 'Action successful.', text_id: 'Tindakan berhasil.' }),
        data
      }

      this.status(code).send(responseObject)
    })

    Response.macro('sendError', function (data = {}, message = undefined, code = 400) {
      message = self.getMessage(message, { text_en: 'Action failed.', text_id: 'Tindakan gagal.' })

      const responseObject = {
        code,
        status: http.STATUS_CODES[code],
        message,
        data
      }

      this.status(code).send(responseObject)
    })

    Response.macro('sendValidationError', function (errorMessages) {
      errorMessages = errorMessages.map(message => {
        return self.getMessage([`validation.${message.validation}`, {
          field: message.field, 
          value: message.value,
          expectedValues: message.expectedValues
        }])
      })

      const code = 422
      const responseObject = {
        code,
        status: http.STATUS_CODES[code],
        message: { text_en: 'Validation failed.', text_id: 'Validasi gagal.' },
        data: {
          errors: errorMessages
        }
      }

      this.status(code).send(responseObject)
    })

    Logger.registerProvider('Response')
  }

  /**
   * Parse and return bilingual version of
   * received message
   *
   * @method getMessage
   * @param {Array | Object} message
   * @param {Object} defaultMessage
   * @param {String} defaultMessage.text_en
   * @param {String} defaultMessage.text_id
   *
   * @return {Object}
   */
  getMessage(message, { text_en, text_id } = {}) {
    const Antl = this.app.use('Antl')
    const { isArray, isString, isObject } = this.app.use('Adonis/Addons/Helpers')

    const InvalidResponseException = this.app.use('App/Exceptions/InvalidResponseException')

    const messageResponse = { text_en, text_id }
    const exception = new InvalidResponseException('Response Message Invalid', 'Pesan Respon Tidak Valid', 500, 'E_INVALID_RESPONSE_MESSAGE')

    if (isArray(message)) {
      if (isString(message[0]) && isObject(message[1])) {
        messageResponse.text_en = Antl.forLocale('en').formatMessage(message[0], message[1])
        messageResponse.text_id = Antl.forLocale('id').formatMessage(message[0], message[1])
      } else if (isString(message[0]) && isString(message[1])) {
        messageResponse.text_en = message[0]
        messageResponse.text_id = message[1]
      } else if (isString(message[0]) && message[1] === false) {
        messageResponse.text_en = Antl.forLocale('en').formatMessage(message[0])
        messageResponse.text_id = Antl.forLocale('id').formatMessage(message[0])
      } else {
        throw exception
      }
    } else if (isObject(message)) {
      if (message.key && message.value) {
        messageResponse.text_en = Antl.forLocale('en').formatMessage(message.key, message.value)
        messageResponse.text_id = Antl.forLocale('id').formatMessage(message.key, message.value)
      } else if (message.text_en && message.text_id) {
        messageResponse.text_en = message.text_en
        messageResponse.text_id = message.text_id
      } else {
        throw exception
      }
    } else {
      throw exception
    }

    return messageResponse
  }

}

module.exports = ResponseProvider