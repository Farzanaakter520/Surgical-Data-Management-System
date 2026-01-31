// routes/quickActions.js
const express = require('express');
const router = express.Router();
const admissionToPostopController = require('../controllers/admissionToPostopController');

const path = 'patient_admission_to_post_op';

// Using similar URL structure
router.post(`/${path}/create`, admissionToPostopController.create);

module.exports = router;
