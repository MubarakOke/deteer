const jwt= require('jsonwebtoken')
const {promisify}= require('util')

module.exports = async (token)=>{
    const decoded= await promisify(jwt.verify)(token, process.env.SECRET_KEY)
    return decoded.id
}