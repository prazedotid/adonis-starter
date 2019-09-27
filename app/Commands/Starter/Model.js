'use strict'

const Helpers = use('Helpers')

const BaseCommand = require('../Base')

const { join } = require('path')
const pluralize = require('pluralize')
const changeCase = require('change-case')

/**
 * Make a new lucid model
 *
 * @class StarterModel
 * @constructor
 */
class StarterModel extends BaseCommand {
  /**
   * The command signature
   *
   * @method signature
   *
   * @return {String}
   */
  static get signature () {
    return `
    starter:model
    { name: Name of the model }
    `
  }

  /**
   * The command description
   *
   * @method description
   *
   * @return {String}
   */
  static get description () {
    return 'Make a new Lucid model'
  }

  /**
   * Handle method executed by ace
   *
   * @method handle
   *
   * @param  {Object} options
   * @param  {String} options.name
   */
  async handle ({ name }) {
    const modelsPath = join(Helpers.appRoot(), 'app', 'Models')
    const templatesPath = join(__dirname, 'Templates')

    await this.invoke(async () => {
      await this.ensureInProjectRoot()

      const modelName = changeCase.pascalCase(pluralize.singular(name))
      const modelExists = await this.pathExists(join(modelsPath, `${modelName}.js`))
      if (modelExists) {
        const confirmDelete = await this.confirm(`A model with the name ${modelName} already exists. Are you sure you want to replace it?`)

        if (!confirmDelete) return false
        await this.removeFile(join(modelsPath, `${modelName}.js`))
      }

      const tableName = await this.ask('Specify table name:', changeCase.snakeCase(pluralize.plural(modelName)))

      let fields = (await this.ask('Specify fields, separated using commas:')).split(',').map(f => ({ name: f.replace(/\s/g, '') }))
      for (const field of fields) {
        const rules = await this.ask('Specify rules for field "' + field.name + '":', 'required|string')

        if (rules !== '') {
          field.rules = rules
        }
      }

      const modelTemplate = await this.readFile(join(templatesPath, 'Model.mustache'), 'UTF-8')
      await this.generateFile(join(modelsPath, `${modelName}.js`), modelTemplate, { modelName, tableName, fields })

      // Show success message on create
      this.completed(`${this.icon('success')} create`, join(modelsPath, `${modelName}.js`))
    })
  }
}

module.exports = StarterModel
