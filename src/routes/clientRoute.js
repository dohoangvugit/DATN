const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')

const clientController = require('../controllers/clientController')

router.get('/tasks', authenticate,  clientController.listTasks)

module.exports = router
