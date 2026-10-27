const Category = require('~/models/category')
const { FIELD_CANNOT_BE_EMPTY, FIELD_CANNOT_BE_LONGER } = require('~/consts/errors')
const {
  lengths: { MAX_NAME_LENGTH }
} = require('~/consts/validation')

describe('Category model', () => {
  it('Should create a valid category with default appearance', () => {
    const category = new Category({ name: 'Mathematics' })
    const error = category.validateSync()

    expect(error).toBeUndefined()
    expect(category.appearance.icon).toBe('mocked-path-to-icon')
    expect(category.appearance.color).toBe('#66C42C')
  })

  it('Should throw a validation error when name is missing', () => {
    const category = new Category()
    const error = category.validateSync()

    expect(error.errors.name.message).toBe(FIELD_CANNOT_BE_EMPTY('name'))
  })

  it('Should throw a validation error when name is too long', () => {
    const category = new Category({ name: 'a'.repeat(MAX_NAME_LENGTH + 1) })
    const error = category.validateSync()

    expect(error.errors.name.message).toBe(FIELD_CANNOT_BE_LONGER('name', MAX_NAME_LENGTH))
  })

  it('Should throw a validation error when icon is null', () => {
    const category = new Category({
      name: 'Mathematics',
      appearance: { icon: null }
    })
    const error = category.validateSync()

    expect(error.errors['appearance.icon'].message).toBe(FIELD_CANNOT_BE_EMPTY('icon'))
  })

  it('Should throw a validation error when color is null', () => {
    const category = new Category({
      name: 'Mathematics',
      appearance: { color: null }
    })
    const error = category.validateSync()

    expect(error.errors['appearance.color'].message).toBe(FIELD_CANNOT_BE_EMPTY('color'))
  })

  it('Should have a unique name field', () => {
    const isUnique = Category.schema.path('name').options.unique

    expect(isUnique).toBe(true)
  })
})
