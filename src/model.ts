import DB, { UserObject, UserStatus } from './db'
import ping from './ping'
import useNamespace from 'debug'
const debug = useNamespace('onewheel-pinger-model')

export default class Model {
  private db: typeof DB

  public constructor (db: typeof DB) {
    this.db = db
  }

  public async handle (phoneNumber: string, message: string) {
    debug(`Received message [${message}] from [${phoneNumber}]`)
    const userObject = await this.db.get(phoneNumber)

    if (typeof userObject === 'undefined') {
      debug(`Setting up user: ${phoneNumber}`)
      return this.setupUser(phoneNumber)
    } else {
      return this.handleCommand(userObject, message)
    }
  }

  private async setupUser (phoneNumber: string) {
    const user = await this.db.addNumber(phoneNumber)
    const setupMessage = await this.setupInfo(user)
    return `Hey! I'm a Onewheel pinger bot to check on the delivery date so you don't have to. I'm going to quickly help you get set up.

Just so you know, all of your data is stored encrypted using AES-256 encryption before it is stored.

${setupMessage}`
  }

  private async setupInfo (user: UserObject) {
    const { number } = user
    await this.db.setStatus(number, UserStatus.sendingOrderNumber)
    return 'Please first send us your order number, and then send us your email address for shipping.'
  }

  private async handleCommand (user: UserObject, message: string) {
    // Prioritize people who don't want to messaged anymore
    if (message.toUpperCase() === 'STOP') {
      await this.db.removeNumber(user.number)
      return "Ok. I won't send you anymore messages unless you text me again."
    }

    // First, check if the user is in a different state
    if (user.status === UserStatus.sendingOrderNumber) {
      return this.handleOrderNumber(user, message)
    } else if (user.status === UserStatus.sendingEmailAddress) {
      return this.handleEmailAddress(user, message)
    }

    // Then, check if it is a command
    if (message.toUpperCase() === 'CHECK') {
      return this.checkDeliveryDate(user)
    } else if (message.toUpperCase() === 'RESET') {
      return this.setupInfo(user)
    } else if (message.toUpperCase() === 'HELP') {
      return 'You can text me `CHECK` to see the delivery date, `RESET` to change your order number or email, and `STOP` to stop receiving texts from me.'
    }

    // Otherwise, send a help message
    return "Hello! I'm a Onewheel pinger bot to check on the delivery date so you don't have to. Type `HELP` to see a list of my commands."
  }

  private async handleOrderNumber (user: UserObject, orderNumber: string) {
    const { number } = user
    const order = +orderNumber
    if (isNaN(order)) {
      return "That doesn't seem right... please try to send your order number again."
    } else {
      await this.db.setOrder(number, order)
      await this.db.setStatus(number, UserStatus.sendingEmailAddress)
      return 'Looks good! Now what is the email address you used to order the Onewheel?'
    }
  }

  private async handleEmailAddress (user: UserObject, email: string) {
    const { number } = user
    await this.db.setEmail(number, email)
    await this.db.setStatus(number, UserStatus.default)
    const changedObject = await this.db.get(number)
    try {
      const deliveryStatus = await this.checkDeliveryDate(changedObject)
      return `${deliveryStatus}

I'll check daily, and keep you posted as to whether the date changes do that you don't have to.

If at any point you want to stop receiving messages, just text me STOP and I won't message you again.`
    } catch (err) {
      return err.message
    }
  }

  private async checkDeliveryDate (user: UserObject) {
    if (typeof user.email === 'undefined' || typeof user.order === 'undefined') {
      return this.setupInfo(user)
    }

    try {
      const date = await ping(user.order, user.email)
      await this.db.setLastDate(user.number, date)
      return `You're scheduled delivery date is ${date}.`
    } catch (error) {
      debug('Error received while trying to ping for a user:')
      debug(error)

      const message = await this.handleError(user)
      throw new Error(message)
    }
  }

  private async handleError (user: UserObject) {
    const { number } = user
    await this.db.removeNumber(number)
    await this.db.addNumber(number)
    const message = await this.setupInfo(user)
    return `Something didn't work when I was trying to check your delivery date, so I'm going to have you re-enter you're data:
  
  ${message}`
  }
}
