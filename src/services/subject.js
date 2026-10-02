const Subject = require('~/models/subject')

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
  }
}

module.exports = subjectService
