
const jwt = require('jsonwebtoken');
const verifyEmail = async (req, res, usersCollection) => {
try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET_EMAIL);

    const result = await usersCollection.updateOne(
        { email },
        { $set: { verified: true } }
    );

    if (result.modifiedCount === 0) {
        return res.status(400).send('Invalid or expired verification link');
    }

    res.send('Email verified successfully. You can now log in.');
} catch (error) {
    res.status(400).send('Invalid or expired verification link');
}}
module.exports = {
    verifyEmail,
};