const express = require('express')
const router = express.Router()
const {getAllTaskLogs} = require('../controllers/managerHistoryUserController')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/manager/history/users', authenticate, authorize.admin, getAllTaskLogs)

module.exports = router