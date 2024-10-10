const jwt = require('jsonwebtoken');
const refreshToken = async (req, res, usersCollection) => {
    const { token } = req.body;
    if (!token) return res.sendStatus(401);

    const user = await usersCollection.findOne({ refreshToken: token });
    if (!user) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET_REFRESH, (err) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign(
            { username: user.username, role: user.role },
            process.env.JWT_SECRET_ACCESS,
            { expiresIn: '15m' }
        );
        res.json({ accessToken });
    });
}
module.exports = {
    refreshToken
};