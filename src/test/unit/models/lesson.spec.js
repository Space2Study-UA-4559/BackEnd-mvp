const { Types } = require('mongoose')

const Lesson = require('~/models/lesson')
const {
  enums: { RESOURCES_TYPES_ENUM }
} = require('~/consts/validation')

const validLesson = {
  title: 'Introduction to chemistry',
  description: 'Basic concepts and terminology.',
  content: 'This lesson introduces the fundamental concepts and terminology of chemistry.',
  author: new Types.ObjectId()
}

describe('Lesson model', () => {
  it('should validate a lesson and set defaults', () => {
    const lesson = new Lesson(validLesson)

    expect(lesson.validateSync()).toBeUndefined()
    expect(lesson.category).toBeNull()
    expect(lesson.resourceType).toBe(RESOURCES_TYPES_ENUM[0])
  })

  it.each([
    ['title', undefined],
    ['description', undefined],
    ['content', undefined],
    ['author', undefined],
    ['title', 'a'.repeat(101)],
    ['description', 'a'.repeat(1001)],
    ['content', 'a'.repeat(49)],
    ['resourceType', 'invalid']
  ])('should reject invalid %s', (field, value) => {
    const lesson = new Lesson({ ...validLesson, [field]: value })

    expect(lesson.validateSync().errors[field]).toBeDefined()
  })
})
