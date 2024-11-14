const { ObjectId } = require('mongodb');  // Hoặc BSON nếu bạn dùng bson package

const getGcode = async (req, res, gcodeCollection,filesCollection) => {
    try {
        // Tạo một đối tượng ObjectId từ chuỗi _id
        const document = await gcodeCollection.findOne({
            "_id": new ObjectId("6734c8ba7f82139a4f0092b5")  // Sử dụng `new ObjectId()`
        });
         await gcodeCollection.updateOne(
            { "_id": new ObjectId("6734c8ba7f82139a4f0092b5") },  // Điều kiện tìm kiếm
            { $set: { "gcode": "" } }  // Cập nhật trường 'readed'
        );
        // Nếu không tìm thấy document
        if (!document) {
            return res.status(404).send('Document không tìm thấy');
        }
        if(document.readed=="Yes"){
         // Lấy tài liệu chứa chuỗi G-code
         const document2 = await filesCollection.findOne({ "_id": new ObjectId("6736296ea86be01ce471e7f7") });
         if (!document2) {
             return res.status(404).send('Document không tìm thấy');
         }
         // Cắt lấy 20 dòng đầu tiên từ G-code
         const gcodeLines = document2.gcode.split('\n');
         const gcode20line = gcodeLines.slice(0, 20).join('\n');
         const remainingGcode = gcodeLines.slice(20).join('\n');
 
         // Cập nhật 20 dòng vào document đích
         await gcodeCollection.updateOne(
             { "_id": new ObjectId("6734c8ba7f82139a4f0092b5") },
             { $set: { "gcode": gcode20line } }
         );
         // Cập nhật lại document nguồn với phần còn lại của G-code
         await filesCollection.updateOne(
             { "_id": new ObjectId("6736296ea86be01ce471e7f7") },
             { $set: { "gcode": remainingGcode } }
         );}
        res.json(document);
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
};

module.exports = {
    getGcode,
};
