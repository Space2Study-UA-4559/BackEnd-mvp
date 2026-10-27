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
const getCategories = async (_req, res) => {
  const categories = await categoryService.getCategories()

  res.status(200).json(categories)
}
const getCategoriesNames = async (_req, res) => {
  const categoriesNames = await categoryService.getCategoriesNames()

  res.status(200).json(categoriesNames)
}
const getCategoryById = async (req, res) => {
  const { id } = req.params

  const category = await categoryService.getCategoryById(id)

  res.status(200).json(category)
}
module.exports = {
  createCategory,
  priceMinMax,
  getCategories,
  getCategoriesNames,
  getCategoryById
}
