const {login}=require('./login')
const {logout}=require('./logout')
const {register}=require('./register')
const {verifyEmail}=require('./verifyEmail')
const { forgotPassword } = require('./forgotPassword');
const { resetPassword } = require('./resetPassword');
const { refreshToken } = require('./refreshToken');
module.exports = {
    login,
    logout,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshToken
};