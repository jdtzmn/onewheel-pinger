import DB, { UserObject, UserStatus } from './db'
import ping from './ping'
import sendMessage from './sendMessage'

async function checkDeliveryDates (users: UserObject[], db: typeof DB) {
  const promises = users.map(async (user) => {
    if (user.status === UserStatus.default) {
      const date = await ping(user.order, user.email)

      if (date !== user.lastDateFromPing) {
        await sendMessage(user.number, `You're delivery date changed from ${user.lastDateFromPing} to ${date}!`)
        await db.setLastDate(user.number, date)
      }
    }
  })

  return Promise.all(promises)
}

export default checkDeliveryDates
