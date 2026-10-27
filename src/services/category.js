const Offer = require('~/models/offer')
const conditionCreator = require('~/utils/categories/conditionCreator')
const Category = require('~/models/category')
const { createError } = require('~/utils/errorsHelper')
const { DOCUMENT_NOT_FOUND } = require('~/consts/errors')
const categoryService = {
  createCategory: async (data) => {
    const { name, appearance } = data

    return await Category.create({ name, appearance })
  },

  priceMinMax: async (searchParams) => {
    const matchCondition = conditionCreator.condition(searchParams)

    const minMaxPrices = await Offer.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          min: { $min: '$price' },
          max: { $max: '$price' }
        }
      }
    ])
    if (!minMaxPrices.length) minMaxPrices[0] = { min: 0, max: 0 }

    return { minPrice: minMaxPrices[0].min, maxPrice: minMaxPrices[0].max }
  },

  getCategories: async () => {
    const categories = await Category.find()

    return categories
  },

  getCategoriesNames: async () => {
    const categoryNames = await Category.find({}, { name: 1, _id: 0 })

    return categoryNames
  },
  getCategoryById: async (id) => {
    const category = await Category.findById(id)
    if (!category) {
      throw createError(404, DOCUMENT_NOT_FOUND([Category.modelName]))
    }
    return category
  }
}

module.exports = categoryService
