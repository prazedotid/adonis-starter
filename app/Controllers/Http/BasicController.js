'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/View')} View */

require('../../../typedefs')

/** @type {import('../../Services/CRUDService')} */
const CRUDService = use('App/Services/CRUDService')

/** @type {import('../../../providers/Helpers')} */
const { isEmptyObject } = use('Adonis/Addons/Helpers')

const { plural } = require('pluralize')

/**
 * Basic resourceful controller
 */
class BasicController {
  constructor (modelName, relations = []) {
    this.modelName = modelName
    this.relations = relations
  }

  get service () {
    return new CRUDService(this.modelName)
  }

  /**
   * Show a list of all instances.
   * GET instances
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {ExtendedResponse} ctx.response
   */
  async index ({ request, response }) {
    const params = request.only(['page', 'limit', 'search', 'sort'])

    if (this.relations.length) {
      params.include = this.relations
    }

    const result = await this.service.findAll(params)

    return response.ok(result, ['crud.list', { model: plural(this.modelName) }])
  }

  /**
   * Create/save a new instance.
   * POST instances
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {ExtendedResponse} ctx.response
   */
  async store ({ request, response }) {
    const bodyData = request.only(this.service.fields())
    const createInstance = await this.service.create(bodyData)

    const result = createInstance.toJSON()
    return response.ok({ result }, ['crud.create', { model: this.modelName }])
  }

  /**
   * Display a single instance.
   * GET instances/:id
   *
   * @param {object} ctx
   * @param {object} ctx.params
   * @param {ExtendedResponse} ctx.response
   */
  async show ({ params, response }) {
    const findInstance = await this.service.model.findOrEmptyObj(params.id)
    const message = isEmptyObject(findInstance)
      ? ['crud.notFound', { model: this.modelName, where: 'id', value: params.id }]
      : ['crud.get', { model: this.modelName }]

    return response.ok({ result: findInstance }, message)
  }

  /**
   * Update instance details.
   * PUT or PATCH instances/:id
   *
   * @param {object} ctx
   * @param {object} ctx.params
   * @param {Request} ctx.request
   * @param {ExtendedResponse} ctx.response
   */
  async update ({ params, request, response }) {
    const bodyData = request.only(this.service.fields())
    const getInstance = await this.service.model.findOrEmptyObj(params.id)
    let message = ['crud.notFound', { model: this.modelName, where: 'id', value: params.id }]

    if (!isEmptyObject(getInstance)) {
      message = ['crud.update', { model: this.modelName }]

      getInstance.merge(bodyData)
      await getInstance.save()
    }

    return response.ok({ result: getInstance }, message)
  }

  /**
   * Delete an instance with id.
   * DELETE instances/:id
   *
   * @param {object} ctx
   * @param {object} ctx.params
   * @param {ExtendedResponse} ctx.response
   */
  async destroy ({ params, response }) {
    const getInstance = await this.service.model.findOrEmptyObj(params.id)
    let message = ['crud.notFound', { model: this.modelName, where: 'id', value: params.id }]

    if (!isEmptyObject(getInstance)) {
      message = ['crud.delete', { model: this.modelName }]

      await getInstance.delete()
    }

    return response.ok({ result: getInstance }, message)
  }
}

module.exports = BasicController
