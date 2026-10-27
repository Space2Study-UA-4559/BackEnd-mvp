const router = require('express').Router()

const asyncWrapper = require('~/middlewares/asyncWrapper')

const locationController = require('~/controllers/location')

const isoCodeValidation = require('~/middlewares/isoCodeValidation')
const stateIsoCodeValidation = require('~/middlewares/stateIsoCodeValidation')

router.param('countryIso', isoCodeValidation)
router.param('stateIso', stateIsoCodeValidation)

router.get('/countries', asyncWrapper(locationController.getCountries))
router.get('/states/:countryIso', asyncWrapper(locationController.getStates))
router.get('/cities/:countryIso/:stateIso', asyncWrapper(locationController.getCities))

module.exports = router
