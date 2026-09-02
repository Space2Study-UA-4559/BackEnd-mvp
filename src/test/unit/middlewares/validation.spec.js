const validationMiddleware = require('~/middlewares/validation')
const { createError } = require('~/utils/errorsHelper')
const {
  BODY_IS_NOT_DEFINED,
  FIELD_IS_NOT_DEFINED,
  FIELD_IS_NOT_OF_PROPER_FORMAT,
  FIELD_IS_NOT_OF_PROPER_ENUM_VALUE
} = require('~/consts/errors')
const signupValidationSchema = require('~/validation/schemas/signup')
const {
  enums: { ROLE_ENUM }
} = require('~/consts/validation')

describe('Validation middleware', () => {
  const middlewareToTest = validationMiddleware(signupValidationSchema)
  const mockResponse = {}
  const mockNextFunc = jest.fn()

  const validBody = {
    firstName: 'Test',
    lastName: 'Test',
    email: 'test@example.com',
    password: 'Test123!',
    role: 'student'
  }

  it('Should throw an error when body is not defined', () => {
    const mockRequest = {}
    const err = createError(422, BODY_IS_NOT_DEFINED)
    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(err)
  })

  it('Should throw an error when required field is missing', () => {
    const bodyWithoutFirstName = { ...validBody }
    delete bodyWithoutFirstName.firstName
    const mockRequest = {
      body: bodyWithoutFirstName
    }

    const err = createError(422, FIELD_IS_NOT_DEFINED('firstName'))
    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(err)
  })

  it('Should throw an error when email format is invalid', () => {
    const mockRequest = {
      body: {
        ...validBody,
        email: 'invalid-email'
      }
    }

    const err = createError(422, FIELD_IS_NOT_OF_PROPER_FORMAT('email'))
    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(err)
  })

  it('Should throw an error when role is invalid', () => {
    const mockRequest = {
      body: {
        ...validBody,
        role: 'invalid-role'
      }
    }

    const err = createError(422, FIELD_IS_NOT_OF_PROPER_ENUM_VALUE('role', ROLE_ENUM))
    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(err)
  })

  it('Should call next when body is valid', () => {
    const mockRequest = {
      body: validBody
    }

    middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(mockNextFunc).toHaveBeenCalled()
  })
})
