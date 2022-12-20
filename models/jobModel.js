const mongoose = require('mongoose')

const jobSchema= new mongoose.Schema({
    role : {
        type: String,
        trim: true
    },
    level : {
        type: String,
        trim: true
    },
    summary : {
        type: String,
        trim: true
    }, 
    timestamp: {
        type: Date,
        default: Date.now
    },
    remote: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'user'
    },
    contact: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'contact'
    }
})


const Job= mongoose.model('job', jobSchema)
module.exports= Job