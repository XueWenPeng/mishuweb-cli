const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')
const ejs = require('ejs')
const downLoadRepo = require('download-git-repo')
const { getRepoList, getTagList } = require('./request')

async function wrapLoading(fn, msg, ...rest) {
  const spinner = ora(msg)
  spinner.start()

  try {
    const result = await fn(...rest)
    spinner.succeed()
    return result
  } catch(err) {
    spinner.fail('Request faild, refetch...')
    return 'faild'
  }
}

class Generator {
  constructor(name, targetDir) {
    this.name = name
    this.targetDir = targetDir
    this.downLoadRepo = util.promisify(downLoadRepo)
  }

  async getRepo() {
    const repoList = await wrapLoading(getRepoList, 'waiting fetch template')
    if (!repoList) return
    const repos = repoList.map(item => item.name)
    const { repo } = await inquirer.prompt([{
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template'
    }])
    return repo
  }

  async getTag(repo) {
    const tagList = await wrapLoading(getTagList, 'waiting fetch tag', repo)
    if(!tagList) return
    const tags = tagList.map(item => item.name)
    const { tag } = await inquirer.prompt([{
      name: 'tag',
      type: 'list',
      choices: tags,
      message: 'Please choose a tag'
    }])
    return tag
  }

  async download(repo, tag) {
    const reqUrl = `mishuweb-cli/${repo}${tag?'#'+tag:''}`
    return await wrapLoading(this.downLoadRepo, 'waiting download tempalte', reqUrl, path.resolve(process.cwd(), this.targetDir))
  }

  async create() {
    const repo = await this.getRepo()
    const tag = await this.getTag(repo)
    const result = await this.download(repo, tag)

    if (result !== 'faild') {
      const destUrl = path.join(this.targetDir, 'public')
      console.log(destUrl)
      await fs.readdir(destUrl, (err, files) => {
        if (err) throw err
        files.forEach(file => {
          ejs.renderFile(path.join(destUrl, file), { name: this.name }).then(data => {
            fs.writeFileSync(path.join(destUrl, file), data)
          })
        })
      })
      console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
      console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
      console.log(' npm install && npm run dev\r\n')
    }
  }
}

module.exports = Generator