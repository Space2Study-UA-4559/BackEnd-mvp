const categoryService = require('~/services/category')

const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body)

  res.status(201).json(category)
}

const priceMinMax = async (req, res) => {
  const { categoryId, subjectId } = req.params
  const { authorRole } = req.query

  const values = await categoryService.priceMinMax({ categoryId, subjectId, authorRole })

  res.status(200).json(values)
}

module.exports = {
  createCategory,
  priceMinMax
}
