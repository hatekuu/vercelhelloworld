const { ObjectId } = require('mongodb');  // Hoặc BSON tùy theo cách bạn import

const getGcode = async (req, res, gcodeCollection) => {
    try {
        // Tìm document trong gcodeCollection theo _id
        const document = await gcodeCollection.findOne({
            "_id": ObjectId("6734c8ba7f82139a4f0092b5")  // Chuyển chuỗi thành ObjectId
        });

        // Nếu không tìm thấy document
        if (!document) {
            return res.status(404).send('Document không tìm thấy');
        }

        // Trả về document tìm được
        res.json(document);
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};


module.exports = {
    getGcode,
};
