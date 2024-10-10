const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const {logout} = require('../userFuntions/logout') 
const {register}= require('../userFuntions/register')
const {verifyEmail}= require('../userFuntions/verifyEmail')
const authRoutes = (client) => {
    const router = express.Router();
    const usersCollection = client.db('3Dprint').collection('users');
    const blacklistedTokensCollection = client.db('3Dprint').collection('blacklistedTokens');
    // Middleware xác thực JWT token
    const verifyToken = async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).send('Token missing');

        const blacklistedToken = await blacklistedTokensCollection.findOne({ token });
        if (blacklistedToken) {
            return res.status(401).send('Token has been revoked');
        }

        jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, user) => {
            if (err) return res.status(403).send('Invalid or expired token');
            req.user = user;
            next();
        });
    };

    // Middleware kiểm tra vai trò
    const verifyRole = (roles) => (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Forbidden: You do not have the required role');
        }
        next();
    };

    // Đăng ký người dùng và gửi email xác thực
    router.post('/register', async (req, res) => {
      register(res,req,usersCollection)
    });

    // Xác thực email
    router.get('/verify-email/:token', async (req, res) => {
        verifyEmail(req,res,usersCollection)
    });

    // Đăng nhập
    router.post('/login', async (req, res) => {
    
    });

    // Gửi email đặt lại mật khẩu
    router.post('/forgot-password', async (req, res) => {
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
    });

    // Đặt lại mật khẩu
    router.post('/reset-password/:token', async (req, res) => {
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
    });

    // Làm mới token
    router.post('/token', async (req, res) => {
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
    });

    // Đăng xuất và đưa token vào danh sách đen
    router.post('/logout', verifyToken, (req, res) => {
        logout(req, res, usersCollection, blacklistedTokensCollection); // Gọi đến controller logout
    });

    // Lấy thông tin người dùng
    router.get('/user', verifyToken, async (req, res) => {
        const user = await usersCollection.findOne({ username: req.user.username }, { projection: { password: 0 } });
        if (!user) return res.sendStatus(404);
        res.json(user);
    });

    // Cập nhật thông tin người dùng
    router.put('/user', verifyToken, async (req, res) => {
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedUser = await usersCollection.updateOne(
            { username: req.user.username },
            { $set: { password: hashedPassword } }
        );

        if (updatedUser.modifiedCount === 0) {
            return res.sendStatus(404);
        }

        res.send('User updated');
    });

    // Route chỉ dành cho quản lý
    router.get('/admin', verifyToken, verifyRole(['manager']), (req, res) => {
        res.send('Hello Manager, this is your admin panel!');
    });

    // Route cho cả user và manager
    router.get('/dashboard', verifyToken, verifyRole(['manager', 'user']), (req, res) => {
        res.send(`Hello ${req.user.username}, welcome to your dashboard!`);
    });

    return router;
};

module.exports = authRoutes;
