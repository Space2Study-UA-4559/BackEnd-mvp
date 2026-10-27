const bcrypt = require('bcrypt')
const { hashPassword, comparePasswords } = require('~/utils/passwordHelper')

describe('Password helper', () => {
  it('Should hash password', async () => {
    const password = 'Test123@'
    const hashedPassword = await hashPassword(password)

    expect(hashedPassword).not.toEqual(password)
    expect(typeof hashedPassword).toBe('string')
  })
  it('Should return true for a correct password', async () => {
    const password = 'Test123@'
    const hashedPassword = await hashPassword(password)
    const result = await comparePasswords(password, hashedPassword)
    expect(result).toBe(true)
  })
  it('Should return false for an incorrect password', async () => {
    const password = 'Test123@'
    const hashedPassword = await hashPassword(password)
    const result = await comparePasswords('Test123', hashedPassword)
    expect(result).toBe(false)
  })
  it('Should use salt rounds between 10 and 12', async () => {
    const password = 'Test123@'
    const hashedPassword = await hashPassword(password)
    const rounds = bcrypt.getRounds(hashedPassword)

    expect(rounds).toBeGreaterThanOrEqual(10)
    expect(rounds).toBeLessThanOrEqual(12)
  })
})
