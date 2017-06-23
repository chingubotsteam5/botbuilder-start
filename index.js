const restify = require('restify')
const builder = require('botbuilder')

// Setup Restify Server
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`${server.name} listening to ${server.url}`)
})

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
})

// Listen for messages from users
server.post('/api/messages', connector.listen())

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
const bot = new builder.UniversalBot(connector, session => {
  session.send(`You said: ${session.message.text}`)
})

bot
  .dialog('help', (session, args, next) => {
    // Send message to the user and end this dialog
    session.endDialog('This is a simple bot that collects a name and age.')
  })
  .triggerAction({
    matches: /^help$/,
    onSelectAction: (session, args, next) => {
      // Add the help dialog to the dialog stack
      // (override the default behavior of replacing the stack)
      session.beginDialog(args.action, args)
    }
  })
