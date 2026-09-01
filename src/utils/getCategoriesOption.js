const getCategoriesOptions = (categories) => {
  if (categories) {
    return categories.map((item) => (item === 'null' ? null : item))
  }
}

module.exports = getCategoriesOptions
