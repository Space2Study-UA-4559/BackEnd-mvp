const router = require('express').Router({ mergeParams: true })

const { authMiddleware } = require('~/middlewares/auth')

router.use(authMiddleware)

module.exports = router
