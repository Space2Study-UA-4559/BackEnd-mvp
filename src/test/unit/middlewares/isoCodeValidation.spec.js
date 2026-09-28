const isoCodeValidation = require('~/middlewares/isoCodeValidation')
const { createError } = require('~/utils/errorsHelper')
const { INVALID_ISO_CODE } = require('~/consts/errors')

describe('ISO code validation middleware', () => {
  const mockResponse = {}
  const mockRequest = {}
  const mockNextFunc = jest.fn()

  beforeEach(() => {
    mockNextFunc.mockClear()
  })

  it('Should call next for an uppercase ISO2 code', () => {
    isoCodeValidation(mockRequest, mockResponse, mockNextFunc, 'UA')
    expect(mockNextFunc).toHaveBeenCalled()
  })
  it('Should call next for a lowercase ISO2 code', () => {
    isoCodeValidation(mockRequest, mockResponse, mockNextFunc, 'ua')
    expect(mockNextFunc).toHaveBeenCalled()
  })
  it('Should throw an error when ISO code has more than two characters', () => {
    const err = createError(400, INVALID_ISO_CODE)
    const validationFunc = () => isoCodeValidation(mockRequest, mockResponse, mockNextFunc, 'UKR')

    expect(validationFunc).toThrow(err)
  })
  it('Should throw an error when ISO code contains a number', () => {
    const err = createError(400, INVALID_ISO_CODE)
    const validationFunc = () => isoCodeValidation(mockRequest, mockResponse, mockNextFunc, 'U1')

    expect(validationFunc).toThrow(err)
  })
  it('Should reject a path traversal value', () => {
    const validationFunc = () => isoCodeValidation(mockRequest, mockResponse, mockNextFunc, '../cities')

    expect(validationFunc).toThrow(createError(400, INVALID_ISO_CODE))
    expect(mockNextFunc).not.toHaveBeenCalled()
  })
})
