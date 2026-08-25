const Comment = require('~/models/comment')
const Cooperation = require('~/models/cooperation')
const { createForbiddenError } = require('~/utils/errorsHelper')

const assertCooperationParticipant = async (cooperationId, userId) => {
  const cooperation = await Cooperation.findById(cooperationId).exec()
  const user = String(userId)
  const isParticipant = String(cooperation.initiator) === user || String(cooperation.receiver) === user

  if (!isParticipant) {
    throw createForbiddenError()
  }
}

const commentService = {
  addComment: async (data) => {
    const { text, author, authorRole, cooperationId } = data

    await assertCooperationParticipant(cooperationId, author)

    return await Comment.create({ author, cooperation: cooperationId, text, authorRole })
  },

  getComments: async (cooperationId, userId) => {
    await assertCooperationParticipant(cooperationId, userId)

    return await Comment.find({ cooperation: cooperationId })
      .populate({ path: 'author', select: ['firstName', 'lastName'] })
      .exec()
  }
}

module.exports = commentService
