const { INVALID_ISO_CODE } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const isoCodeValidation = (req, res, next, isoCode) => {
  if (!/^[A-Za-z]{2}$/.test(isoCode)) {
    throw createError(400, INVALID_ISO_CODE)
  }
  next()
}

module.exports = isoCodeValidation
