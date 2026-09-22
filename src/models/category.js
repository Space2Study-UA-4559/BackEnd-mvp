const { Schema, model } = require('mongoose')
const { CATEGORY } = require('~/consts/models')

const categorySchema = new Schema(
  {
    name: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false
  }
)

module.exports = model(CATEGORY, categorySchema)
