// server.js
const express = require('express');
const { MongoClient } = require('mongodb');
// const authRoutes = require('./controllers/authController');

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

// Đường dẫn xác thực
// app.use('/auth', authRoutes(client));

// Đường dẫn Hello World
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.get('/api/items', async (req, res) => {
    try {
        const database = client.db('3Dprint'); // Thay <database> bằng tên database của bạn
        const collection = database.collection('users'); // Thay 'items' bằng tên collection của bạn

        const items = await collection.find({}).toArray();
        res.json(items);
    } catch (err) {
        console.error('Error retrieving items:', err);
        res.status(500).send('Error retrieving items');
    }
});
// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
