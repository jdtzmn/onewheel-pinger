import twilio from 'twilio'
import env from './env'

const client = twilio(env.sid, env.twilioToken)

async function sendMessage (to: string, body: string) {
  return client.messages.create({
    from: env.phoneNumber,
    to,
    body
  }).catch((err) => console.error(err))
}

export default sendMessage
