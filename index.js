const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db'); // Import hàm connectDB
const authRoutes = require('./controllers/authController');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON
app.use(express.json());

// Cấu hình CORS
app.use(cors({
    origin: process.env.URL_ORIGIN
}));

// Kết nối tới MongoDB khi khởi động server
connectDB().then(() => {
    // Đường dẫn xác thực
    app.use('/auth', authRoutes());

    // Đường dẫn Hello World
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    // Khởi động server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Error starting server:', err);
});
