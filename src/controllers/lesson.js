const lessonService = require('~/services/lesson')

const getLessonById = async (req, res) => {
  const { id } = req.params

  const lesson = await lessonService.getLessonById(id)

  res.status(200).json(lesson)
}

module.exports = { getLessonById }
