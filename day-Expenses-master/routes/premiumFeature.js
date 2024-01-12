const express = require('express');
const router = express.Router();
const premiumFeature = require('../controllers/premiumFeature');
const userauthentication = require('../middleware/auth');


router.get('/showLeaderboard', userauthentication.authenticate, premiumFeature.getUserLeaderboard);

module.exports = router;