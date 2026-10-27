const { Schema, model } = require('mongoose')
const { CATEGORY } = require('~/consts/models')
const {
  lengths: { MIN_NAME_LENGTH, MAX_NAME_LENGTH }
} = require('~/consts/validation')

const { FIELD_CANNOT_BE_EMPTY, FIELD_CANNOT_BE_SHORTER, FIELD_CANNOT_BE_LONGER } = require('~/consts/errors')

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, FIELD_CANNOT_BE_EMPTY('name')],
      minlength: [MIN_NAME_LENGTH, FIELD_CANNOT_BE_SHORTER('name', MIN_NAME_LENGTH)],
      maxlength: [MAX_NAME_LENGTH, FIELD_CANNOT_BE_LONGER('name', MAX_NAME_LENGTH)],
      unique: true
    },
    appearance: {
      icon: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('icon')],
        default: 'mocked-path-to-icon'
      },
      color: {
        type: String,
        required: [true, FIELD_CANNOT_BE_EMPTY('color')],
        default: '#66C42C'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model(CATEGORY, categorySchema)
