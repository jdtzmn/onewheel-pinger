import { config } from 'dotenv'

// Read environment variables
config()

const { PORT, MONGO_STRING, MONGO_DB, ENCRYPTION_KEY, TWILIO_SID, TWILIO_TOKEN, TWILIO_NUMBER } = process.env

export default {
  port: PORT || 3000,
  mongodb: MONGO_STRING || 'mongodb://localhost',
  dbName: MONGO_DB || 'test',
  encryptionKey: ENCRYPTION_KEY,
  sid: TWILIO_SID,
  twilioToken: TWILIO_TOKEN,
  phoneNumber: TWILIO_NUMBER
}
