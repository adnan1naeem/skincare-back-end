const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authorizer = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);
        const currentUser = await User.findById(decoded.id)
        req.user = currentUser;
        next();
    });
};
module.exports = { authorizer }