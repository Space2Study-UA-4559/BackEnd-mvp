const User = require('~/models/user')

describe('User model', () => {
  it('should have nativeLanguage set to null by default', () => {
    const user = new User({
      role: ['student'],
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    })

    expect(user.nativeLanguage).toBeNull()
  })

  it('should validate nativeLanguage when null', () => {
    const user = new User({
      role: ['student'],
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      nativeLanguage: null
    })

    const err = user.validateSync()
    expect(err).toBeUndefined()
  })

  it('should validate nativeLanguage when a valid spoken language is provided', () => {
    const user = new User({
      role: ['student'],
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      nativeLanguage: 'Ukrainian'
    })

    const err = user.validateSync()
    expect(err).toBeUndefined()
  })

  it('should fail validation when nativeLanguage is invalid', () => {
    const user = new User({
      role: ['student'],
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      nativeLanguage: 'InvalidLanguage'
    })

    const err = user.validateSync()
    expect(err).toBeDefined()
    expect(err.errors.nativeLanguage).toBeDefined()
  })
})
