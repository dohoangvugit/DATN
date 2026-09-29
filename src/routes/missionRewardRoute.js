const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')

const missionRewardController = require('../controllers/missionRewardController')

router.post('/start/:taskId', authenticate, missionRewardController.startMission)
router.post('/claim/:taskId', authenticate, missionRewardController.claimReward)

module.exports = router