const { MongoClient } = require('mongodb');
let db;
const connectDB = async () => {
    const client = new MongoClient(process.env.MONGO_URI);
    try {
        await client.connect();
        db = client.db('3Dprint'); // Thay 'yourDatabaseName' bằng tên cơ sở dữ liệu của bạn
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Thoát nếu không thể kết nối
    }
};
const getDB = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
};

module.exports = { connectDB, getDB };
