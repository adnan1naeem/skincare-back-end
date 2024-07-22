const User = require('../../models/User');
const jwt = require('jsonwebtoken');

const router = require('express').Router()
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }
        if (user.role == 'user') {
            return res.status(401).json({ message: 'Users Not Allowed' });
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        console.log(process.env.JWT_SECRET)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
});
module.exports = router