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
  }
}

module.exports = subjectController
