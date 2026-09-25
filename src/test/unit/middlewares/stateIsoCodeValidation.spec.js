const stateIsoCodeValidation = require('~/middlewares/stateIsoCodeValidation')
const { createError } = require('~/utils/errorsHelper')
const { INVALID_STATE_ISO_CODE } = require('~/consts/errors')

describe('ISO code validation middleware', () => {
  const mockResponse = {}
  const mockRequest = {}
  const mockNextFunc = jest.fn()

  beforeEach(() => {
    mockNextFunc.mockClear()
  })

  it('Should call next for a two-letter state code', () => {
    stateIsoCodeValidation(mockRequest, mockResponse, mockNextFunc, 'UA')
    expect(mockNextFunc).toHaveBeenCalled()
  })
  it('Should call next for a numeric state code', () => {
    stateIsoCodeValidation(mockRequest, mockResponse, mockNextFunc, '30')
    expect(mockNextFunc).toHaveBeenCalled()
  })
  it('Should call next for a three-letter state code', () => {
    stateIsoCodeValidation(mockRequest, mockResponse, mockNextFunc, 'UKR')

    expect(mockNextFunc).toHaveBeenCalled()
  })
  const invalidCodes = ['ABCD', 'a-1', '../cities']

  invalidCodes.forEach((code) => {
    it(`Should reject invalid state code "${code}"`, () => {
      const validationFunc = () => stateIsoCodeValidation(mockRequest, mockResponse, mockNextFunc, code)

      expect(validationFunc).toThrow(createError(400, INVALID_STATE_ISO_CODE))
      expect(mockNextFunc).not.toHaveBeenCalled()
    })
  })
})
