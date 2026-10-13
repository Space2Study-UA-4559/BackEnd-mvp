const { Types } = require('mongoose')
const Offer = require('~/models/offer')

const validOffer = {
  price: 1,
  proficiencyLevel: ['Beginner'],
  title: 'English lessons',
  description: 'Lessons for beginners',
  languages: ['English'],
  authorRole: 'tutor',
  author: new Types.ObjectId(),
  subject: new Types.ObjectId(),
  category: new Types.ObjectId()
}

describe('Offer model validation', () => {
  it('accepts a valid offer with optional FAQ', () => {
    expect(new Offer(validOffer).validateSync()).toBeUndefined()
  })

  it('requires all mandatory fields', () => {
    const error = new Offer().validateSync()

    for (const field of Object.keys(validOffer)) {
      expect(error.errors[field]).toBeDefined()
    }
  })

  it('rejects a price below 1', () => {
    const error = new Offer({ ...validOffer, price: 0 }).validateSync()

    expect(error.errors.price).toBeDefined()
  })

  it('rejects title and description above their length limits', () => {
    const error = new Offer({ ...validOffer, title: 'a'.repeat(101), description: 'a'.repeat(1001) }).validateSync()

    expect(error.errors.title).toBeDefined()
    expect(error.errors.description).toBeDefined()
  })

  it('accepts title and description at their length limits', () => {
    const offer = new Offer({ ...validOffer, title: 'a'.repeat(100), description: 'a'.repeat(1000) })

    expect(offer.validateSync()).toBeUndefined()
  })

  it('trims title, description and FAQ entries', () => {
    const offer = new Offer({
      ...validOffer,
      title: '  Title  ',
      description: '  Description  ',
      FAQ: [{ question: '  Question  ', answer: '  Answer  ' }]
    })

    expect(offer.validateSync()).toBeUndefined()
    expect(offer.title).toBe('Title')
    expect(offer.description).toBe('Description')
    expect(offer.FAQ[0].question).toBe('Question')
    expect(offer.FAQ[0].answer).toBe('Answer')
  })

  it('rejects text containing only whitespace', () => {
    const error = new Offer({ ...validOffer, title: '  ', description: '  ' }).validateSync()

    expect(error.errors.title).toBeDefined()
    expect(error.errors.description).toBeDefined()
  })

  it('rejects empty proficiency levels and languages', () => {
    const error = new Offer({ ...validOffer, proficiencyLevel: [], languages: [] }).validateSync()

    expect(error.errors.proficiencyLevel).toBeDefined()
    expect(error.errors.languages).toBeDefined()
  })

  it('requires a question and answer for each FAQ entry', () => {
    const error = new Offer({ ...validOffer, FAQ: [{}, { question: '  ', answer: '  ' }] }).validateSync()

    expect(error.errors['FAQ.0.question']).toBeDefined()
    expect(error.errors['FAQ.0.answer']).toBeDefined()
    expect(error.errors['FAQ.1.question']).toBeDefined()
    expect(error.errors['FAQ.1.answer']).toBeDefined()
  })
})
