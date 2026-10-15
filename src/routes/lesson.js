const router = require('express').Router()

const lessonController = require('~/controllers/lesson')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware } = require('~/middlewares/auth')
const idValidation = require('~/middlewares/idValidation')

router.use(authMiddleware)
router.param('id', idValidation)

router.get('/:id', asyncWrapper(lessonController.getLessonById))

module.exports = router
