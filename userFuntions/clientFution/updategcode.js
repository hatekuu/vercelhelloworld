const { ObjectId } = require('mongodb');  // Hoặc BSON nếu bạn dùng bson package

const updateGcode = async (req, res, gcodeCollection) => {
    try {
        const { readed } = req.body;  // Lấy giá trị của trường 'readed' từ body của request
        // Tạo một đối tượng ObjectId từ chuỗi _id
        const result = await gcodeCollection.updateOne(
            { "_id": new ObjectId("6734c8ba7f82139a4f0092b5") },  // Điều kiện tìm kiếm
            { $set: { "readed": readed } }  // Cập nhật trường 'readed'
        );

        // Kiểm tra kết quả cập nhật
        if (result.modifiedCount === 0) {
            return res.status(404).send('Không có document nào được cập nhật');
        }

        // Trả về kết quả thành công
        res.json({ message: 'Cập nhật thành công', result });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};

module.exports = {
    updateGcode
};
