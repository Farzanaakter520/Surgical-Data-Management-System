// routes/quickActions.js
const express = require('express');
const router = express.Router();
const registrationToPostOpController = require('../controllers/registrationToPostOpController');

const path = 'patient_registration_to_post_op';

// Using similar URL structure
router.post(`/${path}/create`, registrationToPostOpController.create);

module.exports = router;
