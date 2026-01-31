// routes/followupSchedule.js
const express = require('express');
const router = express.Router();
const followupFollowupController = require('../controllers/followupFollowupController');

const path = 'followup-schedule';

// Single endpoint to handle follow-up + follow-up schedule
router.post(`/${path}/create`, followupFollowupController.handleFollowupSchedule);

module.exports = router;
