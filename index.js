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
const bot = new builder.UniversalBot(connector, (session) => {
  session.send(`You said: ${session.message.text}`)
})

// https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-global-handlers
// Trigger a help dialog
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

bot
  .dialog('hello', (session, action, args) => {
    session.endDialog("Hello I'm a parrot")
  })
  .triggerAction({
    matches: /^hello$/,
    onSelectAction: (session, action, args) => {
      session.beginDialog(args.action, args)
    }
  })

bot
  .dialog('listBuilderDialog', function(session) {
    if (!session.dialogData.list) {
      // Start a new list
      session.dialogData.list = []
      session.send(
        "Each message will added as a new item to the list.\nSay 'end list' when finished or 'cancel' to discard the list.\n"
      )
    } else if (/end.*list/i.test(session.message.text)) {
      // Return current list
      session.endDialogWithResult({ response: session.dialogData.list })
    } else {
      // Add item to list and save() change to dialogData
      session.dialogData.list.push(session.message.text)
      session.save()
    }
  })
  .cancelAction('cancelList', 'List canceled', {
    matches: /^cancel/i,
    confirmPrompt: 'Are you sure?'
  })
