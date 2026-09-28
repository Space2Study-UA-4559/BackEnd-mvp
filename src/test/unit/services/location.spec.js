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
describe('States service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should call external API with correct parameters', async () => {
    request.mockResolvedValue({ data: [] })

    await locationService.getStates('UA')

    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.countrystatecity.in/v1/countries/UA/states',
      headers: {
        'X-CSCAPI-KEY': 'test-api-key'
      }
    })
  })
  it('Should return states in the correct format', async () => {
    request.mockResolvedValue({
      data: [
        { id: '4008', name: 'Maharashtra', iso2: 'MH', type: 'state' },
        { id: '4007', name: 'Gujarat', iso2: 'GJ', type: 'state' }
      ]
    })
    const result = await locationService.getStates('IN')
    expect(result).toEqual([
      { name: 'Maharashtra', iso2: 'MH' },
      { name: 'Gujarat', iso2: 'GJ' }
    ])
  })
  it('Should return an empty array when API returns no states', async () => {
    request.mockResolvedValue({ data: [] })

    const result = await locationService.getStates('IN')

    expect(result).toEqual([])
  })
  it('Should reject when external API returns an error', async () => {
    const apiError = new Error('External API error')
    request.mockRejectedValue(apiError)

    await expect(locationService.getStates('IN')).rejects.toThrow('External API error')
  })
})
describe('Cities service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should call external API with correct parameters', async () => {
    request.mockResolvedValue({ data: [] })

    await locationService.getCities('IN', 'MH')

    expect(request).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.countrystatecity.in/v1/countries/IN/states/MH/cities',
      headers: {
        'X-CSCAPI-KEY': 'test-api-key'
      }
    })
  })
  it('Should return cities in the correct format', async () => {
    request.mockResolvedValue({
      data: [
        { id: '134438', name: 'Yaval', kind: 'settlement' },
        { id: '134427', name: 'Yavatmal', kind: 'settlement' },
        { id: '134434', name: 'Yeola', kind: 'settlement' }
      ]
    })
    const result = await locationService.getCities('IN', 'MH')
    expect(result).toEqual([
      { id: '134438', name: 'Yaval' },
      { id: '134427', name: 'Yavatmal' },
      { id: '134434', name: 'Yeola' }
    ])
  })
  it('Should return an empty array when API returns no cities', async () => {
    request.mockResolvedValue({ data: [] })

    const result = await locationService.getCities('IN', 'MH')

    expect(result).toEqual([])
  })
  it('Should reject when external API returns an error', async () => {
    const apiError = new Error('External API error')
    request.mockRejectedValue(apiError)

    await expect(locationService.getCities('IN', 'MH')).rejects.toThrow('External API error')
  })
})
