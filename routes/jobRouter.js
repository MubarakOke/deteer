const express= require('express')
const userController= require('../controllers/userController')
const jobController= require('../controllers/jobController')

// Initialize Router
const router=  express.Router()

// Setting Routers
router
.post('/create-job', userController.protect, jobController.createJob)

router
.get('/my-jobs', userController.protect, jobController.getUserJobs)

router
.route('/job/:id')
.get(jobController.getjob)
.delete(userController.protect, jobController.deleteJob)

router
.get('/jobs', jobController.getJobs)

module.exports= router
