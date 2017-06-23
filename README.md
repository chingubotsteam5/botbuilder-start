# MS Bot Builder SDK for Node.js

Get started:

## Prerequisites

* Node

## Get started

Assuming you have already installed [Node.js][njs], make a folder for the bot, use the following in a terminal to get started:

```shell
mkdir bottington
cd botting*
touch index.js
npm init -y
```

Open up the `index.js` file and copy pasta this code into it:

```javascript
const restify = require('restify')
const builder = require('botbuilder')

// Setup Restify Server
const server = restify.createServer()
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url)
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
  session.send('You said: %s', session.message.text)
})
```

Install the dependencies for the bot:

```shell
npm i botbuilder
npm i restify
```



<!--LINKS-->
[njs]: https://nodejs.org/

