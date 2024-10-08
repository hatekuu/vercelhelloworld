const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const authRoutes = require('./controllers/authController');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON
app.use(express.json());

// Cấu hình CORS - Đặt trước các route để áp dụng cho tất cả yêu cầu
app.use(cors({
    origin: process.env.URL_ORIGIN // lấy URL từ file .env (vd: http://localhost:3000)
}));

// Kết nối tới MongoDB
const client = new MongoClient(process.env.MONGO_URI);
client.connect(err => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        return;
    }
    console.log('Connected to MongoDB');
});

// Đường dẫn xác thực
app.use('/auth', authRoutes(client));

// Đường dẫn Hello World
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
