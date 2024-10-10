const jwt = require('jsonwebtoken');
const forgotPassword = async (req, res, usersCollection) => {
    const { email } = req.body;
    const user = await usersCollection.findOne({ email });

    if (!user) return res.status(404).send('Email does not exist');

    const resetToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET_ACCESS, { expiresIn: '15m' });
    const resetLink = `${process.env.APP_URL}/auth/reset-password/${resetToken}`;

    await transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`
    });

    res.send('Password reset email sent.');
}
module.exports = {
    forgotPassword
};