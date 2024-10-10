// authController.js
const jwt = require('jsonwebtoken');
const { addTokenToBlacklist, logActivity } = require('../serverFuntion/addTokenToBlackList'); // Tách ra các hàm utility nếu cần

// Controller cho việc đăng xuất
const logout = async (req, res, usersCollection, blacklistedTokensCollection) => {
    const token = req.headers['authorization'].split(' ')[1];

    await addTokenToBlacklist(token, blacklistedTokensCollection); // Thêm token vào danh sách đen

    const { username } = req.user;
    const result = await usersCollection.updateOne(
        { username },
        { $unset: { refreshToken: "" } }
    );

    if (result.modifiedCount === 0) {
        return res.status(400).send('User not found or already logged out');
    }

    res.send('Logout successful');
};

module.exports = {
    logout,
};
