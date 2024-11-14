const { getGcode } = require('./gcode');
const { updateGcode } = require('./updategcode');
const {uploadFile}=require('./uploadFIle')

module.exports = {
    uploadFile, 
    getGcode,
    updateGcode
};