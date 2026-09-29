const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize') // 
const taskController = require('../controllers/taskController')

router.get('/manager/tasks', authenticate, authorize.admin, taskController.getAllTasks)
router.post('/manager/tasks', authenticate, authorize.admin, taskController.createTask)
router.put('/manager/tasks/:taskId', authenticate, authorize.admin, taskController.updateTask)
router.delete('/manager/tasks/:taskId', authenticate, authorize.admin, taskController.deleteTask) 

module.exports = router