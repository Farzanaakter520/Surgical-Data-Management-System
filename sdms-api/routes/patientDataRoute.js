// routes/patientDataRoute.js
const express = require('express');
const router = express.Router();
const patientDataController = require('../controllers/patientDataController');

const path = 'patientData';

// Routes for patient data
router.post(`/${path}/getById`, patientDataController.getById);
router.post(`/${path}/getList`, patientDataController.getList);

module.exports = router;
