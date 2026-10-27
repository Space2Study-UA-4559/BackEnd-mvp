const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const isEntityValid = (entities) => {
  const validate = async (req, _res, next) => {
    const models = []

    let id = null

    if (entities.params?.length) {
      for (const { model, idName } of entities.params) {
        id = req.params[idName]

        if (!id) continue

        const document = await model.findById(id)

        if (!document && !models.includes(model.modelName)) models.push(model.modelName)
      }
    }

    if (entities.body?.length) {
      for (const { model, idName } of entities.body) {
        if (Array.isArray(req.body[idName])) {
          await Promise.all(
            req.body[idName].map(async (id) => {
              const document = await model.findById(id)

              if (!document && !models.includes(model.modelName)) {
                models.push(model.modelName)
              }
            })
          )
        } else {
          id = req.body[idName]

          if (!id) continue

          const document = await model.findById(id)

          if (!document && !models.includes(model.modelName)) models.push(model.modelName)
        }
      }
    }

    if (models.length) {
      return next(createError(404, DOCUMENT_NOT_FOUND(models)))
    }

    next()
  }

  return (req, res, next) => validate(req, res, next).catch(next)
}

module.exports = isEntityValid
