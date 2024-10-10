// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { blacklistedTokensCollection } = require('../db'); // Import your blacklisted token collection

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).send('Token missing');

    const blacklistedToken = await blacklistedTokensCollection.findOne({ token });
    if (blacklistedToken) return res.status(401).send('Token has been revoked');

    jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, user) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
};

const verifyRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Forbidden');
    next();
};

module.exports = { verifyToken, verifyRole };
