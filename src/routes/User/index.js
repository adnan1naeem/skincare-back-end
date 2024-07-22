
const router = require('express').Router();

router.use('/skinnalysis', require('./SkinAnalysis'))
router.use('/dailyroutine', require('./DailyRoutine'))
router.use('/users', require('./Users'))

module.exports = router