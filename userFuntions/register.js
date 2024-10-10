
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('./emailService'); // Import hàm gửi email
const { logActivity } = require('./utils'); // Import hàm log nếu cần

// Controller đăng ký
const register = async (req, res, usersCollection) => {
    const { username, email, password } = req.body;

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const userExist = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (userExist) {
        return res.status(400).send('Email or username already exists');
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = {
        username,
        email,
        password: hashedPassword,
        isVerified: false, // Email chưa được xác nhận
        createdAt: new Date(),
    };

    // Lưu user vào cơ sở dữ liệu
    const result = await usersCollection.insertOne(newUser);

    // Tạo token xác nhận email
    const token = jwt.sign({ email }, process.env.JWT_SECRET_EMAIL, { expiresIn: '1h' });

    // Gửi email xác nhận
    await sendConfirmationEmail(email, token);

    res.status(201).send('User registered successfully. Please check your email to verify your account.');

    // Log hoạt động
    await logActivity(newUser, 'User registered', usersCollection);
};

module.exports = {
    register,
};
