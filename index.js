const builder = require('botbuilder')
const restify = require('restify')
const githubClient = require('./github-client.js')

const connector = new builder.ChatConnector()
const bot = new builder.UniversalBot(connector)

const dialog = new builder.IntentDialog()
dialog.matches(/^search/i, [
  (session, args, next) => {
    if (session.message.text.toLowerCase() == 'search') {
      // Prompt user for text
      builder.Prompts.text(session, 'Who do you want to search for?')
    } else {
      const query = session.message.text.substring(7)
      next({ response: query })
    }
  },
  (session, result, next) => {
    const query = result.response
    if (!query) {
      session.endDialog('Request cancelled')
    } else {
      githubClient.executeSearch(query, (profiles) => {
        const totalCount = profiles.total_count
        if (totalCount == 0) {
          session.endDialog('Sorry, no results found.')
        } else if (totalCount > 10) {
          session.endDialog('More than 10 results were found. Please provide a more restrictive query.')
        } else {
          session.dialogData.property = null
          // convert results into array of login names
          const usernames = profiles.items.map((item) => item.login)
          // Prompt user with list
          builder.Prompts.choice(session, 'Which profile do you want to load?', usernames)
        }
      })
    }
  },
  (session, result, next) => {
    // Display final request
    session.send(result.response.entity)
  }
])

bot.dialog('/', dialog)

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url)
})
server.post('/api/messages', connector.listen())
