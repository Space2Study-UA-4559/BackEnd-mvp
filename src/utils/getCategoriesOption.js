const getCategoriesOptions = (categories) => {
  if (categories) {
    const categoriesArray = Array.isArray(categories) ? categories : [categories]
    return categoriesArray.map((item) => (item === 'null' ? null : item))
  }
}

module.exports = getCategoriesOptions
