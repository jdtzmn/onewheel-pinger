import { CronJob } from 'cron'
import checkDeliveryDates from './checkDeliveryDates'
import DB from './db'

export default (db: typeof DB) => {
  CronJob({
    cronTime: '00 00 7 * * *', // Daily at 7am New York time
    async onTick () {
      const users = await db.getAll()
      checkDeliveryDates(users, db)
    },
    start: true,
    timeZone: 'America/New_York'
  })
}
