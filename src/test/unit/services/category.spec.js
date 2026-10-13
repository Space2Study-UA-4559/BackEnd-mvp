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
  it("Should return empty array if don't find any category", async () => {
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
})
