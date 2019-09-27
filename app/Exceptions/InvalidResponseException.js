'use strict'

const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')

let messageEn = 'Response Invalid'
let messageId = 'Respon Tidak Valid'
let status = 500
let code = 'E_INVALID_RESPONSE'

class InvalidResponseException extends InvalidArgumentException {
  /**
   * Handle this exception by itself
   */
  constructor (errMessageEn, errMessageId, errStatus, errCode) {
    messageEn = errMessageEn
    messageId = errMessageId
    status = errStatus
    code = errCode

    super(messageEn, status, code)
  }

  handle (error, { response }) {
    response.status(500).send({
      code: 500,
      status: 'Internal Server Error',
      message: {
        text_en: messageEn,
        text_id: messageId
      },
      data: {}
    })
  }
}

module.exports = InvalidResponseException
