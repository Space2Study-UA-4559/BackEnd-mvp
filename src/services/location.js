const {
  config: { CSC_API_KEY }
} = require('~/configs/config')

const { request } = require('gaxios')

const OLD_API_URL = 'https://countriesnow.space/api/v0.1'
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

  getCities: async (country) => {
    const res = await request({
      method: 'POST',
      url: `${OLD_API_URL}/countries/cities`,
      data: { country }
    })

    return res.data.data
  }
}

module.exports = locationService
