// routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

const path = 'dashboard';

// Using similar URL structure
router.post(`/${path}/getData`, dashboardController.getData);

module.exports = router;
