const express = require('express')
const router = express.Router()
const authorize = require('../middleware/authorize')
const authenticate = require('../middleware/authenticate')
const userController = require('../controllers/userController')

router.put('/manager/users/:id',authenticate, authorize.superadmin, userController.updateUserRole)

router.get('/manager/users',authenticate, authorize.admin, userController.getAllUsers)

router.delete('/manager/users/:id',authenticate, authorize.admin, userController.deleteUser)

module.exports = router