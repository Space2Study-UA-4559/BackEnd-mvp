const Lesson = require('~/models/lesson')
const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')
const { createError } = require('~/utils/errorsHelper')

const lessonService = {
  getLessonById: async (id) => {
    const lesson = await Lesson.findById(id).lean().exec()

    if (!lesson) {
      throw createError(404, DOCUMENT_NOT_FOUND([Lesson.modelName]))
    }

    return lesson
  }
}

module.exports = lessonService
