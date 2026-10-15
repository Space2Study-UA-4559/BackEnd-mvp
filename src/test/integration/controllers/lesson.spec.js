const { Types } = require('mongoose')

const { serverInit, serverCleanup, stopServer } = require('~/test/setup')
const { expectError } = require('~/test/helpers')
const { DOCUMENT_NOT_FOUND, INVALID_ID, UNAUTHORIZED } = require('~/consts/errors')
const testUserAuthentication = require('~/utils/testUserAuth')
const TokenService = require('~/services/token')
const Lesson = require('~/models/lesson')
const {
  roles: { TUTOR }
} = require('~/consts/auth')

const endpointUrl = '/lessons/'
const lessonData = {
  title: 'Introduction to chemistry',
  description: 'Basic concepts and terminology.',
  content: 'This lesson introduces the fundamental concepts and terminology of chemistry.'
}

describe(`GET ${endpointUrl}:id`, () => {
  let app, server, accessToken, lesson

  beforeAll(async () => {
    ;({ app, server } = await serverInit())
  })

  beforeEach(async () => {
    accessToken = await testUserAuthentication(app, { role: TUTOR })
    const { id: author } = TokenService.validateAccessToken(accessToken)
    lesson = await Lesson.create({ ...lessonData, author })
  })

  afterEach(async () => {
    await serverCleanup()
  })

  afterAll(async () => {
    await stopServer(server)
  })

  it('should get a lesson by ID', async () => {
    const response = await app.get(endpointUrl + lesson._id).set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      _id: lesson._id.toString(),
      author: lesson.author.toString(),
      category: null,
      resourceType: 'lessons',
      ...lessonData
    })
  })

  it('should throw INVALID_ID', async () => {
    const response = await app.get(endpointUrl + 'invalid-id').set('Authorization', `Bearer ${accessToken}`)

    expectError(400, INVALID_ID, response)
  })

  it('should throw DOCUMENT_NOT_FOUND', async () => {
    const response = await app
      .get(endpointUrl + new Types.ObjectId())
      .set('Authorization', `Bearer ${accessToken}`)

    expectError(404, DOCUMENT_NOT_FOUND([Lesson.modelName]), response)
  })

  it('should throw UNAUTHORIZED', async () => {
    const response = await app.get(endpointUrl + lesson._id)

    expectError(401, UNAUTHORIZED, response)
  })
})
