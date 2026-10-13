const Offer = require('~/models/offer')
const conditionCreator = require('~/utils/categories/conditionCreator')
const Category = require('~/models/category')

const categoryService = {
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
  }
}

module.exports = categoryService
