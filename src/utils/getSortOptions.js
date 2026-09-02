const getSortOptions = (sort) => {
  try {
    const { order, orderBy } = typeof sort === 'string' ? JSON.parse(sort) : sort
    return { [orderBy || 'updatedAt']: order || 'asc' }
  } catch (error) {
    return { updatedAt: 'asc' }
  }
}

module.exports = getSortOptions
