jest.mock('gaxios')

jest.mock('~/configs/config', () => ({
  config: {
    CSC_API_KEY: 'test-api-key'
  }
}))

const { request } = require('gaxios')
const locationService = require('~/services/location')

describe('Countries service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should call external API with correct parameters', async () => {
    request.mockResolvedValue({
      data: []
    })

    await locationService.getCountries()
    expect(request).toHaveBeenCalledWith({
      url: 'https://api.countrystatecity.in/v1/countries',
      headers: {
        'X-CSCAPI-KEY': 'test-api-key'
      }
    })
  })
  it('Should return countries in the correct format', async () => {
    request.mockResolvedValue({
      data: [
        {
          id: 230,
          name: 'Ukraine',
          iso2: 'UA',
          iso3: 'UKR',
          currency: 'UAH'
        },
        {
          id: 176,
          name: 'Poland',
          iso2: 'PL',
          iso3: 'POL',
          currency: 'PLN'
        }
      ]
    })
    const result = await locationService.getCountries()
    expect(result).toEqual([
      {
        name: 'Ukraine',
        iso2: 'UA'
      },
      {
        name: 'Poland',
        iso2: 'PL'
      }
    ])
  })
  it('Should return an empty array when API returns no countries', async () => {
    request.mockResolvedValue({
      data: []
    })
    const result = await locationService.getCountries()
    expect(result).toEqual([])
  })
  it('Should reject when external API returns an error', async () => {
    const apiError = new Error('External API error')
    request.mockRejectedValue(apiError)

    await expect(locationService.getCountries()).rejects.toThrow('External API error')
  })
})
