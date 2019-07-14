import env from './src/env'
import express from 'express'
import bodyParser from 'body-parser'
import twilio from 'twilio'
import db from './src/db'

import setupJobs from './src/cron'
import Model from './src/model'

const model = new Model(db)
setupJobs(db)

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// Webhook validation setup
const shouldValidate = process.env.NODE_ENV !== 'test'
process.env.TWILIO_AUTH_TOKEN = env.twilioToken
const validationMiddleware = twilio.webhook({ validate: shouldValidate })

// Webhook route
app.post('/', validationMiddleware, async (req, res) => {
  const {
    body: {
      From: phoneNumber,
      Body: message
    }
  } = req

  const trimmedMessage = (message as string).trim()
  const response = await model.handle(phoneNumber, trimmedMessage)

  if (response === undefined) {
    return res.sendStatus(204) // Don't send a message if the `STOP` command is received
  }

  const twiml = new twilio.twiml.MessagingResponse()
  twiml.message(response)

  res.writeHead(200, { 'Content-Type': 'text/xml' })
  res.end(twiml.toString())
})

// Create mongo connection
db.connect()
  .catch((err) => { throw err })

const listener = app.listen(env.port, () => {
  const address = listener.address()
  if (typeof address !== 'string') {
    console.log(`Listening on port: ${address.port}`)
  }
})
