const User = require("../../models/User");
const sendEmail = require("../../utilis/email/SendEmaiil");
const { isFirstDateLarger } = require("../../utilis/helpers/helper");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

const bcryptSalt = 10; // Define your salt rounds here


const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({
            message: "User Not Found"
        })
        const otp = await user.generateVerificationToken(user._id);
        await sendEmail({ to: email, subject: "Reset Password Token", otp })
        return res.status(200).json({ message: "Token Sent",otp });
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


const register = async (req, res) => {
    const { password, lastName, firstName, email, dob, country, gender } = req.body;
    try {
        const user = new User({ password, lastName, firstName, email: email.toLowerCase(), dob, country, gender });
        const useremail = await User.findOne({ email: email.toLowerCase() });
        if (useremail) {
            return res.status(401).json({ message: 'Email already exist' });
        }
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pwd, ...userWithoutPassword } = user.toObject();
        res.json({ token, userWithoutPassword });
        // res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const useralreadyExist = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          return res.status(409).json({ message: 'Email already exists' });
        }
        return res.status(200).json({ message: 'Valid email' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Email does not exist' });
        }
        if (user.role == 'admin') {
            return res.status(401).json({ message: 'Login From Admin Dashboard' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const { password: pwd, ...userWithoutPassword } = user.toObject();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token, userWithoutPassword });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    register,
    forgetPassword,
    resetPassword,
    login,
    useralreadyExist,
}