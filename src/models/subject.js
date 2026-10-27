const { Schema, model } = require('mongoose')
const { CATEGORY, SUBJECT } = require('~/consts/models')
const { FIELD_CANNOT_BE_EMPTY } = require('~/consts/errors')

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      unique: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY,
      required: [true, FIELD_CANNOT_BE_EMPTY('category')]
    },
    totalOffers: {
      student: { type: Number, default: 0 },
      tutor: { type: Number, default: 0 }
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = model(SUBJECT, subjectSchema)
