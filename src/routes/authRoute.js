const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const authController = require('../controllers/authController')

router.get('/login', authController.login)
router.get('/register', authController.register)

router.post('/logout', authenticate, authController.logout)

router.post('/login', authController.loginSubmit)
router.post('/register', authController.registerSubmit)   



module.exports = router
