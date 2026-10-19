const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const advertiserController = require('../controllers/advertiserController')

router.post('/deposit/:id', authenticate, authorize.advertiser, advertiserController.createDeposit)

module.exports = router
