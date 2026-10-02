const router = require('express').Router({ mergeParams: true })
const asyncWrapper = require('~/middlewares/asyncWrapper')
const subjectController = require('~/controllers/subject')

const { authMiddleware } = require('~/middlewares/auth')

router.use(authMiddleware)

router.get('/', asyncWrapper(subjectController.getSubjects))

module.exports = router
