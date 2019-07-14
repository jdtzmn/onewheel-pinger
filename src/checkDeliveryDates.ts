import DB, { UserObject, UserStatus } from './db'
import ping from './ping'
import sendMessage from './sendMessage'
import Model from './model'
import useNamespace from 'debug'
const debug = useNamespace('onewheel-pinger-check-dates')

async function checkDeliveryDates (users: UserObject[], db: typeof DB) {
  const model = new Model(db)

  const promises = users.map(async (user) => {
    if (user.status === UserStatus.default) {
      let date

      try {
        date = await ping(user.order, user.email)
      } catch (error) {
        debug('Error received while trying to check date for a user:')
        debug(error)

        const errorMessage = await model.handleError(user)
        return sendMessage(user.number, errorMessage)
      }

      if (date !== user.lastDateFromPing) {
        await sendMessage(user.number, `You're delivery date changed from ${user.lastDateFromPing} to ${date}!`)
        await db.setLastDate(user.number, date)
      }
    }
  })

  return Promise.all(promises)
}

export default checkDeliveryDates
