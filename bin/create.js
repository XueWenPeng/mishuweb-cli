const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const chalk = require('chalk')
const Generator = require('./generator')

module.exports = async function(name, options) {
  const cwd = process.cwd()
  const targetDir = path.join(cwd, name)

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      let { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Target directory already exists, pick an action:',
        choices: [
          {
            name: 'Overwrite',
            value: 'overwrite'
          },
          {
            name: 'Cancel',
            value: false,
          }
        ]
      }])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(chalk.cyan(`\r\nRemoving...`))
        await fs.remove(targetDir)
      }
    }
  }
  
  const generator = new Generator(name, targetDir)

  generator.create()
}