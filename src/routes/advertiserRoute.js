const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/authenticate')
const authorize = require('../middleware/authorize')
const advertiserController = require('../controllers/advertiserController')

router.post('/deposit', authenticate, authorize.advertiser, advertiserController.createDeposit)

router.get('/advertiser', authenticate, authorize.advertiser, advertiserController.renderAdvertiserDashboard )
router.get('/deposit', authenticate, authorize.advertiser, advertiserController.renderDeposit)

module.exports = router
