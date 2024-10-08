// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

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

// Đường dẫn Hello World
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
