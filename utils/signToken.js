const jwt= require('jsonwebtoken')

module.exports= (id)=>{
    return jwt.sign({id:id}, process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN})
}