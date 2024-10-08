const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const authRoutes = require('./controllers/authController');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Kết nối tới MongoDB
const client = new MongoClient(process.env.MONGO_URI);
client.connect(err => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        return;
    }
    console.log('Connected to MongoDB');
});

// CORS - cấu hình đúng, đặt trước các route
app.use(cors({
    origin: process.env.URL_ORIGIN // chỉ cho phép từ origin này
}));

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
