import { randomBytes } from 'crypto'
import { encrypt, decrypt, hash } from '../src/codec'

describe('codec', () => {
  it('should encrypt a buffer with a random iv every time', () => {
    const buffer = Buffer.from('constant string', 'utf8')
    const encrypted1 = encrypt(buffer)
    const encrypted2 = encrypt(buffer)

    const iv1 = encrypted1.slice(-16)
    const iv2 = encrypted2.slice(-16)

    expect(iv1).not.toEqual(iv2)
  })

  it('should be able to decrypt an encypted buffer', () => {
    const original = randomBytes(32)
    const encrypted = encrypt(original)
    const decrypted = decrypt(encrypted)

    expect(decrypted).toEqual(original)
  })

  it('should hash a buffer to 32 bits', () => {
    const original = randomBytes(16)
    const hashed = hash(original)
    expect(hashed).toHaveLength(32)
  })
})
