const locationService = require('~/services/location')

const getCountries = async (_req, res) => {
  const countries = await locationService.getCountries()

  res.status(200).json(countries)
}

const getCities = async (req, res) => {
  const { countryIso, stateIso } = req.params

  const cities = await locationService.getCities(countryIso, stateIso)

  res.status(200).json(cities)
}
const getStates = async (req, res) => {
  const { countryIso } = req.params

  const states = await locationService.getStates(countryIso)

  res.status(200).json(states)
}
module.exports = {
  getCountries,
  getCities,
  getStates
}
