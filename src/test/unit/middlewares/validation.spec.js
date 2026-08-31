const validationMiddleware = require('~/middlewares/validation')
const { createError } = require('~/utils/errorsHelper')
const { BODY_IS_NOT_DEFINED } = require('~/consts/errors')
const signupValidationSchema = require('~/validation/schemas/signup')

describe('Validation middleware', () => {
  const middlewareToTest = validationMiddleware(signupValidationSchema)
  const mockResponse = {}
  const mockNextFunc = jest.fn()

  it('Should throw an error when body is not defined', () => {
    const mockRequest = {}
    const err = createError(422, BODY_IS_NOT_DEFINED)
    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow(err)
  })

  it('Should throw an error when required field is missing', () => {
    const mockRequest = {
      body: {
        lastName: 'Test',
        email: 'Test@example.com',
        password: 'Test123!',
        role: 'student'
      }
    }

    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow()
  })

  it('Should throw an error when email format is invalid', () => {
    const mockRequest = {
      body: {
        firstName: 'Test',
        lastName: 'Test',
        email: 'invalid-email',
        password: 'Test123!',
        role: 'student'
      }
    }

    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow()
  })

  it('Should throw an error when role is invalid', () => {
    const mockRequest = {
      body: {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@example.com',
        password: 'Test123!',
        role: 'invalid-role'
      }
    }

    const middlewareFunc = () => middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(middlewareFunc).toThrow()
  })

  it('Should call next when body is valid', () => {
    const mockRequest = {
      body: {
        firstName: 'Test',
        lastName: 'test',
        email: 'test@example.com',
        password: 'Test123!',
        role: 'student'
      }
    }

    middlewareToTest(mockRequest, mockResponse, mockNextFunc)

    expect(mockNextFunc).toHaveBeenCalled()
  })
})
