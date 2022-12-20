const mongoose = require('mongoose')
const validator= require('validator')

const contactSchema= new mongoose.Schema({
    firstname : {
        type: String,
        trim: true,
        required: [true, "Please provide a first name"]
    },
    lastname : {
        type: String,
        trim: true,
        required: [true, "Please provide a last name"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validator: [validator.isEmail, "Please enter a valid email"],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, "Please provide a phone"],
        trim: true
    }
})

const Contact= mongoose.model('contact', contactSchema)
module.exports= Contact