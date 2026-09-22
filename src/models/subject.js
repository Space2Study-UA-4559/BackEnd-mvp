const { Schema, model } = require('mongoose')
const { CATEGORY, SUBJECT } = require('~/consts/models')

const subjectSchema = new Schema(
  {
    name: {
      type: String
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: CATEGORY
    }
  },
  { timestamps: true, versionKey: false, strict: false }
)

module.exports = model(SUBJECT, subjectSchema)
