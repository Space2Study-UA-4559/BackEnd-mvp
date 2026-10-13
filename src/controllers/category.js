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
const getCategoriesNames = async (_req, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}

module.exports = {
  priceMinMax,
  getCategories,
  getCategoriesNames
}
