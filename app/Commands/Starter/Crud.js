'use strict'

const Helpers = use('Helpers')

const { join } = require('path')
const BaseCommand = require('../Base')

/**
 * Basic CRUD files generator command
 *
 * @class StarterCrud
 * @extends {Command}
 */
class StarterCrud extends BaseCommand {

  /**
   * Define command signature
   *
   * @readonly
   * @static
   * @memberof OliviaMigrator
   */
  static get signature () {
    return `
    starter:crud
    { name: Lucid Model name to use to create CRUD files. }
    `
  }

  /**
   * Define command description
   *
   * @readonly
   * @static
   * @memberof OliviaMigrator
   */
  static get description () {
    return 'Create basic CRUD files'
  }

  /**
   * Run handler on command execution
   *
   * @param {object} args
   * @memberof OliviaMigrator
   */
  async handle (args) {
    await this.invoke(async () => {
      await this.ensureInProjectRoot()

      // Transform args into model name
      const modelName = args.name.charAt(0).toUpperCase() + args.name.slice(1)

      // Define paths
      const modelsPath = join(Helpers.appRoot(), 'app', 'Models')
      const templatesPath = join(__dirname, 'Templates')
      const controllerPath = join(Helpers.appRoot(), 'app', 'Controllers', 'Http')
      const validatorsPath = join(Helpers.appRoot(), 'app', 'Validators')

      // Check if model file exists, throw error if doesn't
      const modelExists = await this.pathExists(join(modelsPath, `${modelName}.js`))
      if (!modelExists) return this.error(`${this.icon('error')} ${modelName} model does not exist.`)

      // Check if model file has a 'fields' getter, throw error if doesn't
      const model = use(`App/Models/${modelName}`)
      if (!model.fields) return this.error(`${this.icon('error')} ${modelName} model doesn't have a 'fields' getter.`)

      // Check if controller file already exists, remove if user confirms
      const controllerExists = await this.pathExists(join(controllerPath, `${modelName}Controller.js`))
      if (controllerExists) {
        const confirmDelete = await this.confirm(`A file with the name ${modelName}Controller already exists. Are you sure you want to replace it?`)

        if (!confirmDelete) return false
        await this.removeFile(join(controllerPath, `${modelName}Controller.js`))
      }

      // Generate controller
      const controllerTemplate = await this.readFile(join(templatesPath, 'Controller.mustache'), 'UTF-8')
      await this.generateFile(join(controllerPath, `${modelName}Controller.js`), controllerTemplate, { modelName })

      // Show success message on create
      this.completed(`${this.icon('success')} create`, join(controllerPath, `${modelName}Controller.js`))

      // Check if validator directory already exists, remove if user confirms
      const validatorExists = await this.pathExists(join(validatorsPath, modelName))
      if (validatorExists) {
        const confirmDelete = await this.confirm(`A validator directory with the name ${modelName} already exists. Are you sure you want to replace the files?`)

        if (!confirmDelete) return false
        await Promise.all([
          this.removeFile(join(validatorsPath, modelName, 'List.js')),
          this.removeFile(join(validatorsPath, modelName, 'Store.js')),
          this.removeFile(join(validatorsPath, modelName, 'Update.js'))
        ])
      }

      // Generate validators
      const validatorTemplates = {
        List: await this.readFile(join(templatesPath, 'ValidatorList.mustache'), 'UTF-8'),
        Store: await this.readFile(join(templatesPath, 'ValidatorStore.mustache'), 'UTF-8'),
        Update: await this.readFile(join(templatesPath, 'ValidatorUpdate.mustache'), 'UTF-8'),
      }

      await Promise.all([
        ...Object.entries(validatorTemplates).map(
          ([fileName, template]) => this.generateFile(join(validatorsPath, modelName, `${fileName}.js`), template, { modelName })
        )
      ])

      // Show success message on create
      Object.keys(validatorTemplates).forEach(
        (fileName) => this.completed(`${this.icon('success')} create`,  join(validatorsPath, modelName, `${fileName}.js`))
      )
    })
  }
}

module.exports = StarterCrud
