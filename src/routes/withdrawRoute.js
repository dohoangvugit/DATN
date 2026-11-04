const express = require('express')
const router = express.Router()
const authenticaticate = require('../middleware/authenticate')
const withdrawalController = require('../controllers/withdrawalController')

router.get('/withdraw', authenticaticate, withdrawalController.renderWithdraw)
router.post('/withdraw', authenticaticate, withdrawalController.postWithdraw)

module.exports = router
