const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

const clientController = require('../controllers/clientController')

router.get('/tasks', authenticate, authorize.viewer,  clientController.listTasks)

module.exports = router
