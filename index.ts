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

  const response = await model.handle(phoneNumber, message)
  res.send(response)
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
