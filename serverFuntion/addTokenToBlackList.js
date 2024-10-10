// utils.js
const jwt = require('jsonwebtoken');

// Thêm token vào danh sách đen
const addTokenToBlacklist = async (token, blacklistedTokensCollection) => {
    const decoded = jwt.decode(token);
    if (!decoded) throw new Error('Invalid token');
    const expiration = decoded.exp * 1000;
    const expireAt = new Date(expiration);

    await blacklistedTokensCollection.insertOne({ token, expireAt });
};

// Ghi log hoạt động của người dùng
const logActivity = async (user, activity, usersCollection) => {
    await usersCollection.updateOne(
        { username: user.username },
        { $push: { activityLog: { activity, date: new Date() } } }
    );
};

module.exports = {
    addTokenToBlacklist,
    logActivity,
};
