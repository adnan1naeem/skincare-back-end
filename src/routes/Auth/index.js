const router = require('express').Router();
const authController = require('../../Controllers/Auth/auth.controller')
const { authvalidator } = require('../../utilis/Validators');

router.post('/register', authvalidator.UserSignUpValidator, authController.register);
router.post('/login', authController.login);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);
module.exports = router;
