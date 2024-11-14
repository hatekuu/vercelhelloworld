const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const { getDB } = require('../db');
const { login, logout, register, verifyEmail, forgotPassword, resetPassword, refreshToken } = require('../userFuntions/accoutFuntion/accoutFuntion');
const {uploadFile, getGcode,updateGcode} = require("../userFuntions/clientFution/clientFuntion")
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const authRoutes = () => {
    const router = express.Router();
    const db = getDB(); 
    const usersCollection = db.collection('users');
    const filesCollection=db.collection("files")
    const gcodeCollection=db.collection("gcode")
    const blacklistedTokensCollection = db.collection('blacklistedTokens'); 
    // Đăng ký người dùng và gửi email xác thực
    router.get('/gcode', async (req, res) => {
        await getGcode(req, res, gcodeCollection);
    });
    router.get('/updategcode', async (req, res) => {
        await updateGcode(req, res, gcodeCollection);
    });
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
    //Uplad file lên collection
    router.post('/uploadFile',verifyToken, async (req,res)=>{
        await uploadFile(req,res, filesCollection);
    })
    return router;
};

module.exports = authRoutes;
