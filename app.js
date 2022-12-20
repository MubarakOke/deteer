const express= require('express')
const morgan= require('morgan')
const cors= require('cors')
const helmet= require('helmet')
const multer = require('multer')
const mongoSanitize= require('express-mongo-sanitize')
const xss= require('xss-clean')
const AppError= require('./utils/appError')
const GLobalError= require('./controllers/errorController')
const userRouter=  require('./routes/userRouter')
const jobRouter=  require('./routes/jobRouter')

const app= express() 
const upload = multer()

app.use(helmet())
app.use(cors())
app.options('*', cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(upload.array())
app.use(mongoSanitize())
app.use(xss())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/', jobRouter)
app.all('*', (req, res, next)=>{
    next(new AppError(`Can't find ${req.originalUrl}`, 404))
})
app.use(GLobalError)



module.exports= app