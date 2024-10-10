const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const { getDB } = require('../db'); // Lấy database từ db.js
const { login, logout, register, verifyEmail, forgotPassword, resetPassword, refreshToken } = require('../userFuntions/accoutFuntion/accoutFuntion');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const authRoutes = () => {
    const router = express.Router();
    const db = getDB(); // Lấy đối tượng db
    const usersCollection = db.collection('users'); // Lấy collection 'users'
    const blacklistedTokensCollection = db.collection('blacklistedTokens'); // Sửa lỗi cú pháp

    // Đăng ký người dùng và gửi email xác thực
    router.post('/register', async (req, res) => {
        await register(req, res, usersCollection);
    });

    // Xác thực email
    router.get('/verify-email/:token', async (req, res) => {
        await verifyEmail(req, res, usersCollection);
    });

    // Đăng nhập
    router.post('/login', async (req, res) => {
        await login(req, res, usersCollection);
    });

    // Gửi email đặt lại mật khẩu
    router.post('/forgot-password', async (req, res) => {
        await forgotPassword(req, res, usersCollection);
    });

    // Đặt lại mật khẩu
    router.post('/reset-password/:token', async (req, res) => {
        await resetPassword(req, res, usersCollection);
    });

    // Làm mới token
    router.post('/token', verifyRole(['manager', 'user']), async (req, res) => {
        await refreshToken(req, res, usersCollection);
    });

    // Đăng xuất và đưa token vào danh sách đen
    router.post('/logout', verifyToken, verifyRole(['manager', 'user']), async (req, res) => {
        await logout(req, res, usersCollection, blacklistedTokensCollection);
    });

    // Lấy thông tin người dùng
    router.get('/user', verifyToken, verifyRole(['manager', 'user']), async (req, res) => {
        const user = await usersCollection.findOne({ username: req.user.username }, { projection: { password: 0 } });
        if (!user) return res.sendStatus(404);
        res.json(user);
    });

    // Cập nhật thông tin người dùng
    router.put('/user', verifyToken, verifyRole(['manager', 'user']), async (req, res) => {
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
