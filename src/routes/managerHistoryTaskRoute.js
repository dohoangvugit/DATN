const express = require('express')
const router = express.Router()
const {getAllTaskLogs} = require('../controllers/managerHistoryTasksController')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/manager/history/tasks', authenticate, authorize.admin, getAllTaskLogs)

module.exports = router