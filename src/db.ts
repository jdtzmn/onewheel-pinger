import { MongoClient, Db } from 'mongodb'
import env from './env'
import { hash, encrypt, decrypt } from './codec'

export enum UserStatus {
  default,
  sendingOrderNumber,
  sendingEmailAddress
}

export interface UserObject {
  number: string
  email?: string
  order?: number
  status?: UserStatus
  lastDateFromPing?: string
}

export default class DB {
  private static client: MongoClient
  private static db: Db

  public static get isConnected () {
    return this.db !== undefined
  }

  public static async connect () {
    if (!this.client) {
      this.client = new MongoClient(env.mongodb, { useNewUrlParser: true })
      await this.client.connect()
      this.db = this.client.db(env.dbName)
    }
  }

  public static async disconnect () {
    await DB.client.close()
    delete DB.client
    delete DB.db
  }

  private static hashNumber (phoneNumber: string) {
    return hash(Buffer.from(phoneNumber, 'utf8')).toString('base64')
  }

  private static createEncryptedUserBuffer (phoneNumber: string, email?: string, order?: number, status?: UserStatus, date?: string) {
    const data: UserObject = {
      number: phoneNumber
    }

    if (email !== undefined) data.email = email
    if (order !== undefined) data.order = order
    if (status !== undefined) data.status = status
    if (date !== undefined) data.lastDateFromPing = date

    const dataBuffer = Buffer.from(JSON.stringify(data))
    return encrypt(dataBuffer)
  }

  public static async addNumber (phoneNumber: string) {
    const collection = this.db.collection('user')

    await collection.insertOne({
      _id: this.hashNumber(phoneNumber),
      data: this.createEncryptedUserBuffer(phoneNumber)
    })

    const userObject: UserObject = {
      number: phoneNumber
    }
    return userObject
  }

  public static getUserObjectFrom (data: any) {
    const { buffer } = data
    const objString = decrypt(buffer).toString('utf8')
    const userObject: UserObject = JSON.parse(objString)

    return userObject
  }

  public static async get (phoneNumber: string) {
    const collection = this.db.collection('user')

    const _id = this.hashNumber(phoneNumber)
    const document = await collection.findOne({ _id })

    if (document === null) return undefined

    const { data } = document
    return this.getUserObjectFrom(data)
  }

  public static async getAll () {
    const collection = this.db.collection('user')

    const documents = await collection.find()

    let userObjects: UserObject[] = []

    await documents.forEach(({ data }) => {
      const userObject = this.getUserObjectFrom(data)
      userObjects.push(userObject)
    })

    return userObjects
  }

  public static async update (phoneNumber: string, updatedEmail?: string, updatedOrder?: number, updatedStatus?: UserStatus, date?: string) {
    const collection = this.db.collection('user')

    let { email, order, status, lastDateFromPing } = await this.get(phoneNumber)
    if (updatedEmail) email = updatedEmail
    if (updatedOrder) order = updatedOrder
    if (typeof updatedStatus !== 'undefined') status = updatedStatus
    if (date) lastDateFromPing = date

    const _id = this.hashNumber(phoneNumber)
    const query = { _id }

    return collection.replaceOne(query, {
      _id,
      data: this.createEncryptedUserBuffer(phoneNumber, email, order, status, lastDateFromPing)
    })
  }

  public static async setEmail (phoneNumber: string, email: string) {
    return this.update(phoneNumber, email)
  }

  public static async setOrder (phoneNumber: string, order: number) {
    return this.update(phoneNumber, undefined, order)
  }

  public static async setStatus (phoneNumber: string, status: UserStatus) {
    return this.update(phoneNumber, undefined, undefined, status)
  }

  public static async setLastDate (phoneNumber: string, date: string) {
    return this.update(phoneNumber, undefined, undefined, undefined, date)
  }

  public static async removeNumber (phoneNumber: string) {
    const collection = this.db.collection('user')
    const _id = this.hashNumber(phoneNumber)

    const query = { _id }
    return collection.deleteOne(query)
  }
}
