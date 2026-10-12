const subjectService = require('~/services/subject')
const getMatchOptions = require('~/utils/getMatchOptions')
const getSortOptions = require('~/utils/getSortOptions')
const getRegex = require('~/utils/getRegex')

const subjectController = {
  getSubjects: async (req, res) => {
    const { name, sort, skip, limit } = req.query
    const { id } = req.params

    const match = getMatchOptions({
      name: getRegex(name),
      category: id
    })

    const sortOptions = getSortOptions(sort)

    const subjects = await subjectService.getSubjects(match, sortOptions, parseInt(skip), parseInt(limit))

    res.status(200).json(subjects)
  },

  getSubjectById: async (req, res) => {
    const { id } = req.params

    const subject = await subjectService.getSubjectById(id)

    res.status(200).json(subject)
  },

  getNamesByCategoryId: async (req, res) => {
    const { id } = req.params

    const match = getMatchOptions({ category: id })
    const names = await subjectService.getNamesByCategoryId(match)

    res.status(200).json(names)
  }
}

module.exports = subjectController
