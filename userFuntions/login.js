const jwt = require('jsonwebtoken');
const {logActivity}= require('../serverFuntion/addTokenToBlackList')
const login = async (req, res, usersCollection) => {
const { username, password } = req.body;
const user = await usersCollection.findOne({ username });

if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send('Invalid credentials');
}

if (!user.verified) {
    return res.status(403).send('Please verify your email before logging in.');
}

const accessToken = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET_ACCESS,
    { expiresIn: '15m' }
);
const refreshToken = jwt.sign(
    { username: user.username, role: user.role },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: '7d' }
);

await usersCollection.updateOne(
    { username },
    { $set: { refreshToken } }
);
await logActivity(user, 'User logged in');
res.json({ accessToken, refreshToken });}
module.exports = {
    login,
};