
const axios = require('axios')

axios.interceptors.response.use(res => res.data)

async function getRepoList() {
  return axios.get('https://api.github.com/orgs/mishuweb-cli/repos')
}

async function getTagList(repo) {
  return axios.get(`https://api.github.com/repos/mishuweb-cli/${repo}/tags`)
}

module.exports = {
  getRepoList,
  getTagList
}
