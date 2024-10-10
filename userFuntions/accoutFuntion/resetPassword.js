const jwt = require('jsonwebtoken');
const resetPassword = async (req, res, usersCollection) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const { username } = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
        const hashedPassword = await bcrypt.hash(password, 10);

        await usersCollection.updateOne(
            { username },
            { $set: { password: hashedPassword } }
        );

        res.send('Password successfully changed.');
    } catch (err) {
        res.status(403).send('Invalid or expired token');
    }
}
module.exports = {
    resetPassword
};