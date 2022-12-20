const AppError= require('../utils/appError');


const handleDuplicateFieldError= error=>{
    const values= Object.values(error.keyValue).join(' ');
    const message= `Duplicate field value: ${values}, Please use another value`
    return new AppError(message, 400)
}

const handleValidationError= error=>{
    const message= error.message
    return new AppError(message, 400)
}

const handleCastError= error=>{
    const value= error.value
    return new AppError(`${value} is not a valid parameter`, 404)
}

const showErrorDev= (err, res)=>{
    res.status(err.statusCode).json({
                                    status: err.status,
                                    message: err.message,
                                    error: err,
                                    stack: err.stack 
                                    })
}

const showErrorProd= (err, res)=>{
    // Send known error
    if(err.isOperational){
        res.status(err.statusCode).json({
                                        status: err.status,
                                        message: err.message 
                                        })
    }
    //Send unknown error
    else{
        console.error('Error', err)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }

    
}


module.exports= (err, req, res, next)=>{
    err.statusCode= err.statusCode || 500
    err.status= err.status || 'error'

    if(err.code===11000) err= handleDuplicateFieldError(err)
    if(err.name==='ValidationError')err= handleValidationError(err)
    if(err.name==='CastError')err= handleCastError(err)

    if (process.env.NODE_ENV === 'development'){
        showErrorDev(err, res)
    }  
    else if(process.env.NODE_ENV === 'production'){ 
        showErrorProd(err, res)
    } 
}

