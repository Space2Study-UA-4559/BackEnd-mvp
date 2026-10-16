const Subject = require('~/models/subject')
const { createError } = require('~/utils/errorsHelper')
const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')
const filterAllowedFields = require('~/utils/filterAllowedFields')
const { allowedSubjectFieldsForUpdate } = require('~/validation/services/subject')

const subjectService = {
  getSubjects: async (match, sort, skip, limit) => {
    const items = await Subject.find(match)
      .collation({ locale: 'en', strength: 1 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec()

    const count = await Subject.countDocuments(match)

    return { count, items }
  },

  getSubjectById: async (id) => {
    const subject = await Subject.findById(id).lean().exec()

    if (!subject) {
      throw createError(404, DOCUMENT_NOT_FOUND([Subject.modelName]))
    }

    return subject
  },

  getNamesByCategoryId: async (match) => {
    return await Subject.find(match).select('name').exec()
  },

  createSubject: async (subjectData) => {
    const { name, category } = subjectData

    return await Subject.create({ name, category })
  },

  updateSubject: async (id, updateData) => {
    const filteredUpdateData = filterAllowedFields(updateData, allowedSubjectFieldsForUpdate)

    const subject = await Subject.findById(id).exec()

    if (!subject) {
      throw createError(404, DOCUMENT_NOT_FOUND([Subject.modelName]))
    }

    for (const field in filteredUpdateData) {
      subject[field] = filteredUpdateData[field]
    }
    await subject.save()
  }
}

module.exports = subjectService
