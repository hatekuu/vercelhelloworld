// emailService.js
const nodemailer = require('nodemailer');

// Hàm gửi email xác nhận
const sendConfirmationEmail = async (userEmail, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Hoặc bất kỳ dịch vụ email nào bạn sử dụng
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER, // Email người gửi
        to: userEmail, // Email người nhận
        subject: 'Email Confirmation',
        text: `Please confirm your email by clicking on the following link: 
        ${process.env.APP_URL}/confirm/${token}`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendConfirmationEmail,
};
