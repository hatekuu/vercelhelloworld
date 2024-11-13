// authController.js
const jwt = require('jsonwebtoken');
// Controller cho việc đăng xuất
const uploadFile = async (req, res, filesCollection) => {
    const { fileName, fileContent } = req.body;
    await filesCollection.insertOne({fileName,fileContent})
    res.send('uploadFile successful');
};

module.exports = {
    uploadFile,
};
