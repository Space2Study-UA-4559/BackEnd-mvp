const categoryService = require('~/services/category')

const priceMinMax = async (req, res) => {
  const { categoryId, subjectId } = req.params
  const { authorRole } = req.query

  const values = await categoryService.priceMinMax({ categoryId, subjectId, authorRole })

  res.status(200).json(values)
}
const getCategories = async (_req, res) => {
  const categories = await categoryService.getCategories()

  res.status(200).json(categories)
}
module.exports = {
  priceMinMax,
  getCategories
}
