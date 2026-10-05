const router = require('express').Router({ mergeParams: true })
const asyncWrapper = require('~/middlewares/asyncWrapper')
const subjectController = require('~/controllers/subject')
const idValidation = require('~/middlewares/idValidation')

const { authMiddleware } = require('~/middlewares/auth')

router.use(authMiddleware)
router.param('id', idValidation)

router.get('/', asyncWrapper(subjectController.getSubjects))
router.get('/:id', asyncWrapper(subjectController.getSubjectById))

module.exports = router
