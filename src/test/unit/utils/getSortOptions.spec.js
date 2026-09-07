const getSortOptions = require('~/utils/getSortOptions')

describe('getSortOptions', () => {
  it('Should parse a JSON string sort and return the corresponding sort options', () => {
    const result = getSortOptions(JSON.stringify({ order: 'desc', orderBy: 'createdAt' }))

    expect(result).toEqual({ createdAt: 'desc' })
  })

  it('Should accept a plain object sort and return the corresponding sort options', () => {
    const result = getSortOptions({ order: 'desc', orderBy: 'createdAt' })

    expect(result).toEqual({ createdAt: 'desc' })
  })

  it('Should fall back to defaults when order and orderBy are missing', () => {
    const result = getSortOptions({})

    expect(result).toEqual({ updatedAt: 'asc' })
  })

  it('Should fall back to defaults when the JSON string is invalid', () => {
    const result = getSortOptions('not-a-json-string')

    expect(result).toEqual({ updatedAt: 'asc' })
  })

  it('Should fall back to defaults when sort is undefined', () => {
    const result = getSortOptions(undefined)

    expect(result).toEqual({ updatedAt: 'asc' })
  })
})
