const builder = require('botbuilder')
const restify = require('restify')

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})

// create the bot
const bot = new builder.UniversalBot(connector)

// create the server
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${server.name} listening to ${server.url}`)
})
// listen on
server.post('/api/messages', connector.listen())

// debug with `node --debug index.js`
// add dialog, build user profile
bot.dialog('/', [
  (session) => {
    session.beginDialog('/ensureProfile', session.userData.profile)
  },
  (session, results) => {
    session.userData.profile = results.response
    session.send(`Hello ${session.userData.profile.response} I love ${session.userData.profile.company}`)
  }
])

// build the ensureProfile dialog
bot.dialog('/ensureProfile', [
  (session, args, next) => {
    session.dialogData.profile = args || {}
    if (!session.dialogData.profile.name) {
      builder.Prompts.text(session, `What's your name?`)
    } else {
      next()
    }
  },
  (session, args, next) => {
    session.dialogData.profile = args || {}
    if (!session.dialogData.profile.company) {
      builder.Prompts.text(session, 'What company do you work for?')
    } else {
      next()
    }
  },
  (session, results) => {
    if (results.response) {
      session.dialogData.profile.company = results.response
    }
    session.endDialogWithResult({ response: session.dialogData.profile })
  }
])
