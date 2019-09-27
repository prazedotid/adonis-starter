'use strict'

const { Command } = require('@adonisjs/ace')
const path = require('path')

class BaseCommand extends Command {
  /**
   * Invokes a function, by automatically catching for errors
   * and printing them in a standard way
   *
   * @method invoke
   *
   * @param  {Function} callback
   *
   * @return {void}
   */
  async invoke (callback) {
    try {
      await callback()
    } catch (error) {
      this.printError(error)
      process.exit(1)
    }
  }

  /**
   * Prints error object to the console
   *
   * @method printError
   *
   * @param  {Object}   error
   *
   * @return {void}
   */
  printError (error) {
    console.log(`\n  ${this.chalk.bgRed(' ERROR ')} ${error.message}\n`)

    if (error.hint) {
      console.log(`\n  ${this.chalk.bgRed(' HELP ')} ${error.hint}\n`)
    }
  }

  /**
   * Throws exception when user is not inside the project root
   *
   * @method ensureInProjectRoot
   *
   * @return {void}
   */
  async ensureInProjectRoot () {
    const exists = await this.pathExists(path.join(process.cwd(), 'ace'))
    if (!exists) {
      throw new Error(`Make sure you are inside an adonisjs app to run the ${this.constructor.commandName} command`)
    }
  }
}

module.exports = BaseCommand
