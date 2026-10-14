const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const testUserAuthentication = require('~/utils/testUserAuth')
const Category = require('~/models/category')
const Subject = require('~/models/subject')
const {
  UNAUTHORIZED,
  FORBIDDEN,
  INVALID_ID,
  DOCUMENT_NOT_FOUND,
  DOCUMENT_ALREADY_EXISTS
} = require('~/consts/errors')
const { expectError } = require('~/test/helpers')

const endpointUrl = '/subjects/'
const nonExistingCategoryId = '6329a45601bd35b5fff1cf8c'
const nonExistingSubjectId = '6329a45601bd35b5fff1cf8d'

const adminUser = {
  role: ['admin'],
  firstName: 'TestAdmin',
  lastName: 'AdminTest',
  email: 'testadmin@gmail.com',
  password: 'supersecretpass123',
  appLanguage: 'en',
  isEmailConfirmed: true,
  isFirstLogin: false,
  lastLoginAs: 'admin'
}

describe('Subject controller', () => {
  let app, server, accessToken

  beforeAll(async () => {
    ;({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    accessToken = await testUserAuthentication(app)

    const category = await Category.create({ name: 'testCategory' })

    await Subject.create({
      name: 'testSubject',
      category: category._id
    })
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  describe(`test GET ${endpointUrl}`, () => {
    it('should GET all subjects', async () => {
      const response = await app.get(endpointUrl).set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(expect.objectContaining({ count: 1, items: [expect.any(Object)] }))
    })

    it('should throw UNAUTHORIZED error', async () => {
      const response = await app.get(endpointUrl)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should GET subjects filtered by name', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      await Subject.create({
        name: 'English',
        category: category._id
      })

      const response = await app
        .get(endpointUrl)
        .query({ name: 'English' })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.count).toBe(1)
      expect(response.body.items[0].name).toBe('English')
      expect(response.body.items[0].totalOffers).toEqual({ student: 0, tutor: 0 })
    })

    it('should paginate subjects with skip and limit', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      await Subject.create({
        name: 'secondSubject',
        category: category._id
      })

      const response = await app
        .get(endpointUrl)
        .query({ skip: 0, limit: 1 })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.count).toBe(2)
      expect(response.body.items).toHaveLength(1)
    })

    it('should return empty list when no subjects match the filter', async () => {
      const response = await app
        .get(endpointUrl)
        .query({ name: 'no-matching-subject-name' })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual({ count: 0, items: [] })
    })

    it('should sort subjects using sort query parameter', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      await Subject.create([
        { name: 'Alpha', category: category._id },
        { name: 'Zulu', category: category._id }
      ])

      const response = await app
        .get(endpointUrl)
        .query({ sort: JSON.stringify({ order: 'asc', orderBy: 'name' }) })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.count).toBe(3)
      expect(response.body.items.map((subject) => subject.name)).toEqual(['Alpha', 'testSubject', 'Zulu'])
    })
  })

  describe('test GET /categories/:id/subjects/', () => {
    it('should return only special category subjects', async () => {
      const specialCategory = await Category.create({ name: 'specialCategory' })
      await Subject.create({
        name: 'specialSubject',
        category: specialCategory._id
      })

      const response = await app
        .get(`/categories/${specialCategory._id}${endpointUrl}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.count).toBe(1)
      expect(response.body.items[0].name).toBe('specialSubject')
    })

    it('should throw INVALID_ID error when category id is invalid', async () => {
      const response = await app.get(`/categories/invalid${endpointUrl}`).set('Authorization', `Bearer ${accessToken}`)

      expectError(400, INVALID_ID, response)
    })

    it('should throw DOCUMENT_NOT_FOUND error when category does not exist', async () => {
      const response = await app
        .get(`/categories/${nonExistingCategoryId}${endpointUrl}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expectError(404, DOCUMENT_NOT_FOUND([Category.modelName]), response)
    })
  })

  describe('test GET /categories/:id?/subjects/names', () => {
    it('should GET subject names by category id', async () => {
      const specialCategory = await Category.create({ name: 'specialCategory' })
      await Subject.create({
        name: 'specialSubject',
        category: specialCategory._id
      })

      const response = await app
        .get(`/categories/${specialCategory._id}/subjects/names`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual([
        expect.objectContaining({
          _id: expect.any(String),
          name: 'specialSubject'
        })
      ])
      expect(response.body[0]).not.toHaveProperty('category')
      expect(response.body[0]).not.toHaveProperty('totalOffers')
    })

    it('should GET all subject names when category id is omitted', async () => {
      const specialCategory = await Category.create({ name: 'specialCategory' })
      await Subject.create({
        name: 'specialSubject',
        category: specialCategory._id
      })

      const response = await app.get('/categories/subjects/names').set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toHaveLength(2)
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'testSubject' }),
          expect.objectContaining({ name: 'specialSubject' })
        ])
      )
    })

    it('should throw UNAUTHORIZED error', async () => {
      const response = await app.get('/categories/subjects/names')

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw INVALID_ID error when category id is invalid', async () => {
      const response = await app
        .get('/categories/invalid/subjects/names')
        .set('Authorization', `Bearer ${accessToken}`)

      expectError(400, INVALID_ID, response)
    })

    it('should throw DOCUMENT_NOT_FOUND error when category does not exist', async () => {
      const response = await app
        .get(`/categories/${nonExistingCategoryId}/subjects/names`)
        .set('Authorization', `Bearer ${accessToken}`)

      expectError(404, DOCUMENT_NOT_FOUND([Category.modelName]), response)
    })
  })

  describe(`test GET ${endpointUrl}:id`, () => {
    it('should GET subject by id', async () => {
      const subject = await Subject.findOne({ name: 'testSubject' }).lean()

      const response = await app.get(endpointUrl + subject._id).set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body).toEqual(
        expect.objectContaining({
          _id: subject._id.toString(),
          name: 'testSubject',
          category: subject.category.toString(),
          totalOffers: { student: 0, tutor: 0 }
        })
      )
    })

    it('should throw UNAUTHORIZED error', async () => {
      const subject = await Subject.findOne({ name: 'testSubject' })

      const response = await app.get(endpointUrl + subject._id)

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw INVALID_ID error when subject id is invalid', async () => {
      const response = await app.get(endpointUrl + 'invalid').set('Authorization', `Bearer ${accessToken}`)

      expectError(400, INVALID_ID, response)
    })

    it('should throw DOCUMENT_NOT_FOUND error when subject does not exist', async () => {
      const response = await app.get(endpointUrl + nonExistingSubjectId).set('Authorization', `Bearer ${accessToken}`)

      expectError(404, DOCUMENT_NOT_FOUND([Subject.modelName]), response)
    })
  })

  describe(`test POST ${endpointUrl}`, () => {
    let adminAccessToken

    beforeEach(async () => {
      adminAccessToken = await testUserAuthentication(app, adminUser)
    })

    it('should create a new subject', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      const response = await app
        .post(endpointUrl)
        .send({ name: 'English', category: category._id })
        .set('Authorization', `Bearer ${adminAccessToken}`)

      expect(response.statusCode).toBe(201)
      expect(response.body).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          name: 'English',
          category: category._id.toString(),
          totalOffers: { student: 0, tutor: 0 },
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      )
    })

    it('should throw UNAUTHORIZED error', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      const response = await app.post(endpointUrl).send({ name: 'English', category: category._id })

      expectError(401, UNAUTHORIZED, response)
    })

    it('should throw FORBIDDEN error for non-admin user', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      const response = await app
        .post(endpointUrl)
        .send({ name: 'English', category: category._id })
        .set('Authorization', `Bearer ${accessToken}`)

      expectError(403, FORBIDDEN, response)
    })

    it('should throw DOCUMENT_NOT_FOUND error when category does not exist', async () => {
      const response = await app
        .post(endpointUrl)
        .send({ name: 'English', category: nonExistingCategoryId })
        .set('Authorization', `Bearer ${adminAccessToken}`)

      expectError(404, DOCUMENT_NOT_FOUND([Category.modelName]), response)
    })

    it('should throw VALIDATION_ERROR when name is missing', async () => {
      const category = await Category.findOne({ name: 'testCategory' })

      const response = await app
        .post(endpointUrl)
        .send({ category: category._id })
        .set('Authorization', `Bearer ${adminAccessToken}`)

      expect(response.statusCode).toBe(409)
      expect(response.body).toEqual(
        expect.objectContaining({
          status: 409,
          code: 'VALIDATION_ERROR'
        })
      )
    })

    it('should throw DOCUMENT_ALREADY_EXISTS when subject name is duplicated', async () => {
      const category = await Category.findOne({ name: 'testCategory' })
      await Subject.syncIndexes()

      const response = await app
        .post(endpointUrl)
        .send({ name: 'testSubject', category: category._id })
        .set('Authorization', `Bearer ${adminAccessToken}`)

      expectError(409, DOCUMENT_ALREADY_EXISTS('name'), response)
    })
  })
})
