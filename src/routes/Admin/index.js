const router = require('express').Router()
router.use('/', require('./Auth'))
router.use('/products', require('./ProductList'))
module.exports = router