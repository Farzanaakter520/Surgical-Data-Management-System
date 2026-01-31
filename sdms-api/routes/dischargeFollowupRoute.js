// routes/dischargeFollowup.js
const express = require('express');
const router = express.Router();
const dischargeFollowupController = require('../controllers/dischargeFollowupController');

const path = 'discharge-followup';

// Single endpoint to handle discharge + follow-up schedule
router.post(`/${path}/handle`, dischargeFollowupController.handleDischargeFollowup);

module.exports = router;
