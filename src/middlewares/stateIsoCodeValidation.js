const { INVALID_STATE_ISO_CODE } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const stateIsoCodeValidation = (req, res, next, isoCode) => {
  if (!/^[A-Za-z0-9]{1,3}$/.test(isoCode)) {
    throw createError(400, INVALID_STATE_ISO_CODE)
  }
  next()
}

module.exports = stateIsoCodeValidation
