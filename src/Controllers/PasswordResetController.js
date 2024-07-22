const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utilis/email/SendEmaiil");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { isFirstDateLarger } = require("../utilis/helpers/helper");

const bcryptSalt = 10; // Define your salt rounds here


const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) return Error('user not found')
    const otp = await user.generateVerificationToken(user._id);
    await sendEmail({ to: email, subject: "Reset Password Token", otp })
    return res.status(200).json({ message: "Token Sent", });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body
    const user = await User.findOne({
      email,
    });

    if (!user) return res.status(400).json({
      message: "User Not Found"
    })
    const isEqual = token == user?.resetPasswordToken
    if (!isEqual)
      return res.status(400).json({
        message: "Invalid Token"
      })

    const isValid = isFirstDateLarger(user.resetPasswordExpire, new Date())
    if (!isValid)
      return res.status(400).json({
        message: "Token Expired"
      })

    const salt = await bcrypt.genSalt(10);

    await User.updateOne({ _id: user._id }, {
      $set: {
        password: await bcrypt.hash(password, salt)
      },
      $unset: {
        resetPasswordToken: null
      }
    })
    return res.status(200).json({ message: 'success' })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ message: error.message })
  }
};

module.exports = {
  forgetPassword,
  resetPassword,
};
