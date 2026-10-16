const router = require('express').Router({ mergeParams: true })
const Category = require('~/models/category')
const {
  roles: { ADMIN }
} = require('~/consts/auth')
const subjectController = require('~/controllers/subject')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const idValidation = require('~/middlewares/idValidation')
const isEntityValid = require('~/middlewares/entityValidation')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')

const body = [{ model: Category, idName: 'category' }]

router.use(authMiddleware)
router.param('id', idValidation)

router.get('/names', asyncWrapper(subjectController.getNamesByCategoryId))
router.get('/', asyncWrapper(subjectController.getSubjects))
router.get('/:id', asyncWrapper(subjectController.getSubjectById))
router.post('/', restrictTo(ADMIN), isEntityValid({ body }), asyncWrapper(subjectController.createSubject))
router.patch('/:id', restrictTo(ADMIN), isEntityValid({ body }), asyncWrapper(subjectController.updateSubject))

module.exports = router
