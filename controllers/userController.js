const User= require('../models/userModel')
const crypto=  require('crypto')
const catchAsync= require('../utils/catchAsync')
const AppError= require('../utils/appError')
const decodeToken= require('../utils/decodeToken')
const signToken= require('../utils/signToken')
const sendEmail= require('../utils/sendEmail')


exports.login= catchAsync(async (req, res, next)=>{
    const {email, password}= req.body // Get input parameters

    // Input parameters checking
    if(!email || !password){
        return next(new AppError('Please enter an email and a password', 400))
    }

    // Get user based on input parameter
    const user = await User.findOne({email}).select("+password")

    // Check password
    if(!user || !await user.correctPassword(password, user.password)){
        return next(new AppError('Incorrect email or password', 401)) 
    }

    // Generate token
    const token= signToken(user._id)
    user.password= undefined
    
    // Send Response
    res.status(200).json({
        status: 'success',
        data: {
            token,
            user
        }
    })
})  


exports.signUp= catchAsync(async (req, res, next)=>{
    const {email, password}= req.body
    let user= await User.create({email, password}) 
    user.password= undefined
    let token= signToken(user._id) // generate token 

    res.status(201).json({
        status: 'success',
        data: {
            token,
            user
        } 
        })
})

exports.protect= catchAsync(async (req, res, next)=>{
    const token= req.headers.authorization
    let decodedID
    if(!token || !token.startsWith('Bearer')){
        return next(new AppError('You are not authorized', 400))
    }

    try{
        decodedID= await decodeToken(token.split(' ')[1])
    }
    catch{
        return next(new AppError('Invalid token', 400))
    }

    let user= await User.findById(decodedID)
    if(!user){
        return next(new AppError('User cannot be found', 400))
    }
    req.user= user
    next()
})

exports.forgotPassword= catchAsync(async(req, res, next)=>{
    const email= req.body.email
    if(!email){
        return next(new AppError('Please provide an email', 400)) 
    }
    const user= await User.findOne({email})
    if(!user){
        return next(new AppError('Email address not found', 404))
    }
    const resetToken= user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false });

    try{
        const resetURL= `${req.protocol}://${req.get('host')}/api/v1/user/password/reset/${resetToken}`
        const message= `click on this link to enter your new password \n ${resetURL}`
        await sendEmail({email: user.email, 
                        subject: 'reset email link valid for 10 mins',
                        message})
        res.status(200).json({
                            status: 'success',
                            message: 'Reset link sent to email'
                            })
    }
    catch{
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new AppError('There was an error sending the email. Try again later.'), 500)
    }
})

exports.resetPaswordRedirect= (req, res, next)=>{
    const token= req.params.token
    const {FRONTEND_URL}= process.env
    return res.redirect(`${FRONTEND_URL}?token=${token}`)
}

exports.resetPassword= catchAsync(async (req, res, next)=>{
    const token= req.body.token
    if(!token){
        return next(new AppError("No reset token", 400))
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      })
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
      }

    const password= req.body.password
    if(!password){
        return next(new AppError('Please specify your new password', 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
                        status: 'success',
                        message: 'Password reset successfully'
                        })
})