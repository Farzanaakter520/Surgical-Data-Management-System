// routes/optionData.js
const express = require('express');
const router = express.Router();
const optionDataController = require('../controllers/optionDataController');

const path = 'options';

// Using similar URL structure
router.post(`/${path}/getOptionData`, optionDataController.getOptionData);

module.exports = router;
