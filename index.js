const builder = require('botbuilder')
const restify = require('restify')
const githubClient = require('./github-client.js')

const connector = new builder.ChatConnector()
const bot = new builder.UniversalBot(connector)

const dialog = new builder.IntentDialog()

dialog.matches(/^search/i, [
  (session, args, next) => {
    if (session.message.text.toLowerCase() == 'search') {
      builder.Prompts.text(session, 'Who are you looking for?')
    } else {
      const query = session.message.text.substring(7)
      next({
        response: query
      })
    }
  },
  (session, result, next) => {
    const query = result.response
    if (!query) {
      session.endDialog('Request cancelled')
    } else {
      githubClient.executeSearch(query, profiles => {
        const totalCount = profiles.total_count
        if (totalCount == 0) {
          session.endDialog('Sorry, no results found.')
        } else if (totalCount > 10) {
          session.endDialog('More than 10 results were found. Please provide a more restrictive query.')
        } else {
          session.dialogData.property = null
          const cards = profiles.items.map(item => createCard(session, item))

          const message = new builder.Message(session).attachments(cards).attachmentLayout('carousel')
          session.send(message)
        }
      })
    }
  },
  (session, result, next) => {
    const username = result.response.entity
    githubClient.loadProfile(username, profile => {
      const card = new builder.ThumbnailCard(session)

      card.title(profile.login)

      card.images([builder.CardImage.create(session, profile.avatar_url)])

      if (profile.name) card.subtitle(profile.name)

      let text = ''
      if (profile.company) text += `${profile.company} \n`
      if (profile.email) text += `${profile.email} \n`
      if (profile.bio) text += profile.bio
      card.text(text)

      card.tap(new builder.CardAction.openUrl(session, profile.html_url))

      const message = new builder.Message(session).attachments([card])
      session.send(message)
    })
  }
])

const createCard = (session, profile) => {
  const card = new builder.ThumbnailCard(session)

  card.title(profile.login)
  card.images([builder.CardImage.create(session, profile.avatar_url)])

  card.tap(new builder.CardAction.openUrl(session, profile.html_url))

  return card
}

bot.dialog('/', dialog)

const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url)
})
server.post('/api/messages', connector.listen())