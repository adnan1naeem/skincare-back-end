
const router = require('express').Router()
router.use('/', require('./Auth'))
router.use('/products', require('./ProductList'))
router.use('/skinAnalysis',require('./Analysis'))
router.use('/description',require('./Description'))
module.exports = router