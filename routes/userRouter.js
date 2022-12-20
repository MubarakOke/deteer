const express= require('express')
const userController= require('../controllers/userController')

// Initialize Router
const router=  express.Router()

// Setting Routers
router
.post('/signup', userController.signUp)
router
.post('/login', userController.login)
router
.post('/forgot-password', userController.forgotPassword)
router
.put('/reset-password', userController.resetPassword)
.patch('/reset-password', userController.resetPassword)
router
.get('/password/reset/:token', userController.resetPaswordRedirect)

module.exports= router