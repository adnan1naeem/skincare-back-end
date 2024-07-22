const { authorizer } = require('../Middlewares/auth.middleware');
const router = require('express').Router();

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });
router.use('/auth', require('./Auth'))
router.use('/admin', require('./Admin'))
router.use(authorizer)
router.use('/user', require('./User'))
module.exports = router;
