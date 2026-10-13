jest.mock('~/models/category', () => ({
  find: jest.fn()
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
})
