const builder = require('botbuilder')
const restify = require('restify')

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})

// create the bot
const bot = new builder.UniversalBot(connector)

// add dialog
bot.dialog('/', [
  (session) => {
    builder.Prompts.text(session, 'Please enter your name')
  },
  (session, result) => {
    session.send('Hello, ' + result.response)
  }
])

// create the server
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${server.name} listening to ${server.url}`)
})
// listen on
server.post('/api/messages', connector.listen())
