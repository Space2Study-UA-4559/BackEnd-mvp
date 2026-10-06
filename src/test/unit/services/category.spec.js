const Category = require('~/models/category')
const categoryService = require('~/services/category')

jest.mock('~/models/category', () => ({ create: jest.fn() }))
jest.mock('~/models/offer', () => ({}))

describe('Category service: createCategory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('passes only name and appearance to the model and returns the created category', async () => {
    const appearance = { icon: '/icons/test.svg', color: '#123456' }
    const saved = { _id: 'category-id', name: 'Test Category', appearance }
    Category.create.mockResolvedValue(saved)

    const result = await categoryService.createCategory({
      name: 'Test Category',
      appearance,
      _id: 'client-supplied-id',
      createdAt: '2000-01-01',
      extra: 'ignored'
    })

    expect(Category.create).toHaveBeenCalledWith({ name: 'Test Category', appearance })
    expect(result).toBe(saved)
  })

  it('leaves omitted appearance to the model defaults', async () => {
    await categoryService.createCategory({ name: 'Test Category' })

    expect(Category.create).toHaveBeenCalledWith({ name: 'Test Category' })
  })

  it.each([
    new Error('Database unavailable'),
    Object.assign(new Error('Category validation failed'), { name: 'ValidationError' }),
    Object.assign(new Error('Duplicate name'), { name: 'MongoServerError', code: 11000 })
  ])('propagates model errors to the error middleware: %s', async (error) => {
    Category.create.mockRejectedValueOnce(error)

    await expect(categoryService.createCategory({ name: 'Test Category' })).rejects.toBe(error)
  })
})
