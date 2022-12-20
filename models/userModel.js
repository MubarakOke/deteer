const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt= require('bcryptjs')
const crypto= require('crypto')

const userSchema= new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validator: [validator.isEmail, "Please enter a valid email"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minLength: [8, 'Passsword must be longer than 8 characters'],
        select: false
    },
    verified:{
        type: Boolean,
        default: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password= await bcrypt.hash(this.password, 12)
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.createPasswordResetToken= function(){
    const resetToken= crypto.randomBytes(32).toString('hex')
    this.passwordResetToken= crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpiry= Date.now() + 10*60*1000
    return resetToken
}


const User= mongoose.model('user', userSchema)

module.exports= User