const Job= require('../models/jobModel')
const Contact= require('../models/contactModel')
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/appError')

exports.createJob= catchAsync(async (req, res, next)=>{
    let {role, level, summary, remote, firstname, lastname, email, phone}= req.body
    const contact= await Contact.create({firstname, lastname, email, phone})
    const job= await Job.create({role, level, summary, remote, contact, user:req.user})

    res.status(201).json({
        message: 'success',
        data: {
            job
        }
    })
})


exports.getJobs= catchAsync(async(req, res, next)=>{
    const job= await Job.find(req.query).populate("contact", "-_id -__v")
    
    res.status(200).json({
        message: 'success',
        count: job.length,
        data: {
            job
        }
    })
})

exports.getUserJobs= catchAsync(async(req, res, next)=>{
    const job= await Job.find({user:req.user}).populate("contact", "-_id -__v")
    res.status(200).json({
        message: 'success',
        count: job.length,
        data: {
            job
        }
    })
})

exports.getjob= catchAsync(async (req, res, next)=>{
    const id= req.params.id

    if(!id){
        return next(new AppError('Please specify ID', 400))
    }
    const job= await Job.findOne({_id: id}).populate("contact", "-_id -__v")
    if(!job){
        return next(new AppError('No job matching the ID', 400))
    }

    res.status(200).json({
        message: 'success',
        data: {
            job
        }
    })
})

exports.deleteJob= catchAsync(async (req, res, next)=>{
    const id= req.params.id
    const job= await Job.findById(id).populate("user", "-_id -__v")

    if(!job){
        return next(new AppError("Job with this ID does not exist", 404)) 
    }
    if(req.user.email!==job.user.email){
        return next(new AppError("You don't have permission to delete this object", 403)) 
    }
    await Job.findByIdAndDelete(id)
    res.status(204).json({
        message: 'success',
    })
})