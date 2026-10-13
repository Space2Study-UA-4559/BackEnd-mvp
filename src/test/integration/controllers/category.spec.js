/// <reference types="jest" />

const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const testUserAuthentication = require('~/utils/testUserAuth')
const Category = require('~/models/category')
const {
  roles: { STUDENT }
} = require('~/consts/auth')

const endpointUrl = '/categories'
const namesEndpointUrl = `${endpointUrl}/names`

describe('Category controller', () => {
  let app, server, accessToken

  beforeAll(async () => {
    ;({ app, server } = await serverInit())
  })
  beforeEach(async () => {
    accessToken = await testUserAuthentication(app, { role: STUDENT })

    await Category.create({
      name: 'Test category'
    })
  })
  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })
  it('Should get categories', async () => {
    const response = await app.get(endpointUrl).set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
  })
  it('Should response to be array', async () => {
    const response = await app.get(endpointUrl).set('Authorization', `Bearer ${accessToken}`)
    expect(Array.isArray(response.body)).toBe(true)
  })
  it('Should contain created category', async () => {
    const response = await app.get(endpointUrl).set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.some((el) => el.name === 'Test category')).toBe(true)
  })
  it('Should have status 401', async () => {
    const response = await app.get(endpointUrl)
    expect(response.status).toBe(401)
  })
  it('Should have empty array', async () => {
    await Category.deleteMany({})
    const response = await app.get(endpointUrl).set('Authorization', `Bearer ${accessToken}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  describe(`GET ${namesEndpointUrl}`, () => {
    it('Should return category names', async () => {
      const response = await app.get(namesEndpointUrl).set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([{ name: 'Test category' }])
      expect(response.body[0]).not.toHaveProperty('_id')
      expect(response.body[0]).not.toHaveProperty('appearance')
    })

    it('Should return an empty array when no categories are found', async () => {
      await Category.deleteMany({})

      const response = await app.get(namesEndpointUrl).set('Authorization', `Bearer ${accessToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it('Should return 401 without an access token', async () => {
      const response = await app.get(namesEndpointUrl)

      expect(response.status).toBe(401)
    })
  })
})
