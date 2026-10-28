const express = require('express')
const router = express.Router()
const {getAllUserLogs} = require('../controllers/managerHistoryUserController')
const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')

router.get('/manager/history/users', authenticate, authorize.admin, getAllUserLogs)

module.exports = router