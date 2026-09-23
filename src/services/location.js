const {
  config: { CSC_API_KEY }
} = require('~/configs/config')

const { request } = require('gaxios')

const CSC_API_URL = 'https://api.countrystatecity.in/v1'

const locationService = {
  getCountries: async () => {
    const res = await request({
      url: `${CSC_API_URL}/countries`,
      headers: {
        'X-CSCAPI-KEY': CSC_API_KEY
      }
    })
    const countries = res.data.map((country) => ({
      name: country.name,
      iso2: country.iso2
    }))

    return countries
  },

  getCities: async (countryIso, stateIso) => {
    const res = await request({
      method: 'GET',
      url: `${CSC_API_URL}/countries/${countryIso}/states/${stateIso}/cities`,
      headers: {
        'X-CSCAPI-KEY': CSC_API_KEY
      }
    })

    return res.data.map(({ id, name }) => ({
      id,
      name
    }))
  },

  getStates: async (countryIso) => {
    const res = await request({
      method: 'GET',
      url: `${CSC_API_URL}/countries/${countryIso}/states`,
      headers: {
        'X-CSCAPI-KEY': CSC_API_KEY
      }
    })
    return res.data.map(({ name, iso2 }) => ({
      name,
      iso2
    }))
  }
}

module.exports = locationService
