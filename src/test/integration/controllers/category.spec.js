const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const Category = require('~/models/category')
const testUserAuthentication = require('~/utils/testUserAuth')
const { expectError } = require('~/test/helpers')
const { UNAUTHORIZED, FORBIDDEN, DOCUMENT_ALREADY_EXISTS } = require('~/consts/errors')
const logger = require('~/logger/logger')
const {
  roles: { ADMIN, STUDENT, TUTOR }
} = require('~/consts/auth')

describe('POST /categories', () => {
  let app, server
  const tokens = {}
  const defaults = { icon: 'mocked-path-to-icon', color: '#66C42C' }
  const postCategory = (body) => app.post('/categories').set('Authorization', `Bearer ${tokens[ADMIN]}`).send(body)

  beforeAll(async () => {
    jest.spyOn(logger, 'error').mockImplementation(() => {})
    ;({ app, server } = await serverInit())
    await Category.createIndexes()

    for (const role of [ADMIN, STUDENT, TUTOR]) {
      tokens[role] = await testUserAuthentication(app, {
        role,
        firstName: 'Category',
        lastName: 'Tester',
        email: `category-${role}@example.com`,
        password: 'CategoryTest123',
        isEmailConfirmed: true,
        lastLoginAs: role
      })
      expect(tokens[role]).toEqual(expect.any(String))
    }
  })

  beforeEach(async () => {
    await Category.deleteMany({})
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.spyOn(logger, 'error').mockImplementation(() => {})
  })

  afterAll(async () => {
    try {
      await serverCleanup()
    } finally {
      if (server) await stopServer(server)
      jest.restoreAllMocks()
    }
  })

  it('creates a category with custom appearance and persists it', async () => {
    const data = { name: 'Test Category', appearance: { icon: '/icons/test.svg', color: '#123456' } }
    const response = await postCategory(data)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      ...data,
      _id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
    expect(await Category.findById(response.body._id).lean()).toMatchObject(data)
  })

  it.each([
    [{ name: 'Test Category' }, defaults],
    [{ name: 'Test Category', appearance: {} }, defaults],
    [
      { name: 'Test Category', appearance: { color: '#123456' } },
      { ...defaults, color: '#123456' }
    ],
    [
      { name: 'Test Category', appearance: { icon: '/test.svg' } },
      { ...defaults, icon: '/test.svg' }
    ]
  ])('applies defaults for omitted appearance fields: %j', async (data, appearance) => {
    const response = await postCategory(data)

    expect(response.statusCode).toBe(201)
    expect(response.body.appearance).toEqual(appearance)
    expect(await Category.findById(response.body._id).lean()).toMatchObject({ appearance })
  })

  it('ignores client-supplied identifiers, timestamps and unknown fields', async () => {
    const suppliedId = '64884f21fdc2d1a130c24ac0'
    const response = await postCategory({
      name: 'Test Category',
      _id: suppliedId,
      createdAt: '2000-01-01T00:00:00.000Z',
      extra: true,
      appearance: { ...defaults, extra: true }
    })

    expect(response.statusCode).toBe(201)
    expect(response.body._id).not.toBe(suppliedId)
    expect(response.body.createdAt).not.toBe('2000-01-01T00:00:00.000Z')
    expect(response.body).not.toHaveProperty('extra')
    expect(response.body.appearance).toEqual(defaults)
  })

  it.each([
    {},
    { name: '' },
    { name: null },
    { name: ['Test Category'] },
    { name: 'a'.repeat(31) },
    { name: 'Test Category', appearance: [] },
    { name: 'Test Category', appearance: 'blue' },
    { name: 'Test Category', appearance: false },
    { name: 'Test Category', appearance: { icon: null } },
    { name: 'Test Category', appearance: { icon: '' } },
    { name: 'Test Category', appearance: { color: null } },
    { name: 'Test Category', appearance: { color: '' } }
  ])('returns 409 without saving data rejected by the model: %j', async (body) => {
    const response = await postCategory(body)

    expect(response.statusCode).toBe(409)
    expect(response.body).toEqual({ status: 409, code: 'VALIDATION_ERROR', message: expect.any(String) })
    expect(await Category.countDocuments()).toBe(0)
  })

  it.each([
    [
      { name: 123, appearance: { color: 123 } },
      { name: '123', appearance: { ...defaults, color: '123' } }
    ],
    [{ name: '   ' }, { name: '   ', appearance: defaults }],
    [
      { name: 'Test Category', appearance: null },
      { name: 'Test Category', appearance: defaults }
    ]
  ])('uses the existing model casting and validation rules: %j', async (data, expected) => {
    const response = await postCategory(data)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject(expected)
    expect(await Category.findById(response.body._id).lean()).toMatchObject(expected)
  })

  it.each(['a', 'a'.repeat(30)])('accepts the name length boundary: %s', async (name) => {
    expect((await postCategory({ name })).statusCode).toBe(201)
  })

  it('returns 409 for a duplicate name', async () => {
    expect((await postCategory({ name: 'Test Category' })).statusCode).toBe(201)
    const response = await postCategory({ name: 'Test Category' })

    expect(response.statusCode).toBe(409)
    expectError(409, DOCUMENT_ALREADY_EXISTS('name'), response)
    expect(await Category.countDocuments({ name: 'Test Category' })).toBe(1)
  })

  it('prevents duplicate names during concurrent requests', async () => {
    const responses = await Promise.all([
      postCategory({ name: 'Test Category' }),
      postCategory({ name: 'Test Category' })
    ])

    expect(responses.map(({ statusCode }) => statusCode).sort()).toEqual([201, 409])
    expect(await Category.countDocuments({ name: 'Test Category' })).toBe(1)
  })

  it.each([undefined, 'Bearer invalid-token'])('returns 401 for invalid authorization: %s', async (authorization) => {
    const request = app.post('/categories').send({ name: 'Test Category' })
    if (authorization) request.set('Authorization', authorization)
    const response = await request

    expect(response.statusCode).toBe(401)
    expectError(401, UNAUTHORIZED, response)
    expect(await Category.countDocuments()).toBe(0)
  })

  it.each([STUDENT, TUTOR])('returns 403 for role %s', async (role) => {
    const response = await app
      .post('/categories')
      .set('Authorization', `Bearer ${tokens[role]}`)
      .send({ name: 'Test Category' })

    expect(response.statusCode).toBe(403)
    expectError(403, FORBIDDEN, response)
    expect(await Category.countDocuments()).toBe(0)
  })

  it('keeps existing category price-range routes accessible to students', async () => {
    const response = await app
      .get('/categories/subjects/price-range?authorRole=tutor')
      .set('Authorization', `Bearer ${tokens[STUDENT]}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ minPrice: 0, maxPrice: 0 })
  })

  it('returns a structured 500 response when saving fails', async () => {
    jest.spyOn(Category, 'create').mockRejectedValueOnce(new Error('Database unavailable'))
    const response = await postCategory({ name: 'Test Category' })

    expect(response.statusCode).toBe(500)
    expectError(500, { code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' }, response)
    expect(await Category.countDocuments()).toBe(0)
  })
})
