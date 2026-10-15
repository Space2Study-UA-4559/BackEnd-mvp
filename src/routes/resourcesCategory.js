const router = require('express').Router()

const ResourceCategory = require('~/models/resourcesCategory')
const asyncWrapper = require('~/middlewares/asyncWrapper')
const { authMiddleware, restrictTo } = require('~/middlewares/auth')
const isEntityValid = require('~/middlewares/entityValidation')
const idValidation = require('~/middlewares/idValidation')
const resourcesCategoryController = require('~/controllers/resourcesCategory')

const {
  roles: { STUDENT, TUTOR }
} = require('~/consts/auth')

const params = [{ model: ResourceCategory, idName: 'id' }]
router.param('id', idValidation)

router.use(authMiddleware)
router.delete(
  '/:id',
  restrictTo(STUDENT, TUTOR),
  isEntityValid({ params }),
  asyncWrapper(resourcesCategoryController.deleteResourceCategory)
)
router.use(restrictTo(TUTOR))
router.get('/', asyncWrapper(resourcesCategoryController.getResourcesCategories))
router.get('/names', asyncWrapper(resourcesCategoryController.getResourcesCategoriesNames))
router.post('/', asyncWrapper(resourcesCategoryController.createResourcesCategory))
router.patch('/:id', isEntityValid({ params }), asyncWrapper(resourcesCategoryController.updateResourceCategory))

module.exports = router
