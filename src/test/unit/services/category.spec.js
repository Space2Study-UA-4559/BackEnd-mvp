jest.mock('~/models/category', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  modelName: 'Category'
}))

const Category = require('~/models/category')
const categoryService = require('~/services/category')

describe('Categories service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('Should run Category.find()', async () => {
    Category.find.mockResolvedValue([])
    await categoryService.getCategories()
    expect(Category.find).toHaveBeenCalledTimes(1)
    expect(Category.find).toHaveBeenCalledWith()
  })
  it('Service should return categories', async () => {
    const categories = ['Math', 'English', 'Nature']
    Category.find.mockResolvedValue(categories)
    const result = await categoryService.getCategories()
    expect(result).toEqual(categories)
  })
  it('Should return an empty array when no categories are found', async () => {
    const categories = []
    Category.find.mockResolvedValue(categories)
    const result = await categoryService.getCategories()
    expect(result).toEqual(categories)
  })
  it('Should return error', async () => {
    const testError = new Error('Test error')
    Category.find.mockRejectedValue(testError)
    await expect(categoryService.getCategories()).rejects.toThrow('Test error')
  })

  describe('getCategoriesNames', () => {
    it('Should request only category names', async () => {
      Category.find.mockResolvedValue([])

      await categoryService.getCategoriesNames()

      expect(Category.find).toHaveBeenCalledWith({}, { name: 1, _id: 0 })
    })

    it('Should return category names', async () => {
      const categoryNames = [{ name: 'Math' }, { name: 'English' }]
      Category.find.mockResolvedValue(categoryNames)

      const result = await categoryService.getCategoriesNames()

      expect(result).toEqual(categoryNames)
    })

    it('Should return an empty array when no category names are found', async () => {
      Category.find.mockResolvedValue([])

      const result = await categoryService.getCategoriesNames()

      expect(result).toEqual([])
    })

    it('Should reject when retrieving category names fails', async () => {
      Category.find.mockRejectedValue(new Error('Test error'))

      await expect(categoryService.getCategoriesNames()).rejects.toThrow('Test error')
    })
  })

  describe('getCategoryById', () => {
    const categoryId = '507f1f77bcf86cd799439011'

    it('Should request a category by ID', async () => {
      Category.findById.mockResolvedValue({ _id: categoryId, name: 'Math' })

      await categoryService.getCategoryById(categoryId)

      expect(Category.findById).toHaveBeenCalledWith(categoryId)
    })

    it('Should return a category', async () => {
      const category = { _id: categoryId, name: 'Math' }
      Category.findById.mockResolvedValue(category)

      const result = await categoryService.getCategoryById(categoryId)

      expect(result).toEqual(category)
    })

    it('Should throw DOCUMENT_NOT_FOUND when a category does not exist', async () => {
      Category.findById.mockResolvedValue(null)

      await expect(categoryService.getCategoryById(categoryId)).rejects.toMatchObject({
        status: 404,
        code: 'DOCUMENT_NOT_FOUND',
        message: 'Category with the specified ID was not found.'
      })
    })

    it('Should reject when retrieving a category fails', async () => {
      Category.findById.mockRejectedValue(new Error('Test error'))

      await expect(categoryService.getCategoryById(categoryId)).rejects.toThrow('Test error')
    })
  })
})
