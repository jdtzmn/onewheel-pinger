import crypto from 'crypto'
const hashAlgorithm = 'sha256'
const encryptionAlgorithm = 'aes-256-cbc'
import env from './env'
const { encryptionKey: key } = env

export function hash (buffer: Buffer): Buffer {
  return crypto.createHash(hashAlgorithm).update(buffer).digest()
}

export function encrypt (buffer: Buffer): Buffer {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(encryptionAlgorithm, key, iv)
  let encrypted = cipher.update(buffer)
  encrypted = Buffer.concat([encrypted, cipher.final(), iv])
  return encrypted
}

export function decrypt (buffer: Buffer): Buffer {
  const iv = buffer.slice(-16)
  const encrypted = buffer.slice(0, -16)
  let decipher = crypto.createDecipheriv(encryptionAlgorithm, key, iv)
  let decrypted = decipher.update(encrypted)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted
}