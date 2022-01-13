#!/usr/bin/env node

const program = require('commander')
const create = require('./create')
const figlet = require('figlet')
const chalk = require('chalk')

program
  .command('create <project-name>')
  .description('create a new project')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    create(name, options)
  })

program
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program.on('--help', () => {
  console.log('\r\n' + figlet.textSync('mishu', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 60,
    whitespaceBreak: true
  }))

  console.log(`\r\nRun ${chalk.cyan(`msc <command> --help`)} show details\r\n`)
})

program.parse(process.argv)