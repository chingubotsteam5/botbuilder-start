# MS Bot Builder SDK for Node.js

Get started: this is my take on the documentation [here][bbstart]

## Prerequisites

* Node

## Get started

Assuming you have already installed [Node.js][njs], make a folder for the bot, use the following in a terminal to get started:

```shell
mkdir bottington #srs call it whatever you like
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

Install the dependencies for the bot, from the terminal:

```shell
npm i botbuilder
npm i restify
```

Add an npm script into the `package.json` file:

```json
  "scripts": {
    "start": "node index.js"
  },
```

Then start the bot with `npm start`, you should see the `restify` output and that's your bot running locally.

## Bot Framework Emulator

Now your bot is running locally but how do you work with it? Microsoft have made us an emulator, you'll need to download it from [here][botemu] and install it. Once installed you'll also need to install `ngrok` for tunneling, so `npm i -g ngrok` and we're good to go.

Take a note of the `npm` output for the install location of `ngrok` as we'll need the install location for the emulator settings, in the emulator add the `ngrok` path to the `App Settings` section of the emulator.

So now get the local host endpoint and enter it into the emulators address bar, and click `CONNECT` then enter some text into the emulator, the bot should repeat what you have just typed.


<!--LINKS-->
[njs]: https://nodejs.org/
[bbstart]: https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-overview
[botemu]: https://github.com/Microsoft/BotFramework-Emulator/releases