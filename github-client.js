const querystring = require('querystring')
const https = require('https')

module.exports = {
  executeSearch(query, callback) {
    this.loadData(`/search/users?q=${querystring.escape(query)}`, callback)
  },

  loadProfile(username, callback) {
    this.loadData(`/users/${querystring.escape(username)}`, callback)
  },

  loadData(path, callback) {
    const options = {
      host: 'api.github.com',
      port: 443,
      path,
      method: 'GET',
      headers: {
        'User-Agent': 'sample-bot'
      }
    }
    let profile
    const request = https.request(options, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        callback(JSON.parse(data))
      })
    })
    request.end()
  }
}
