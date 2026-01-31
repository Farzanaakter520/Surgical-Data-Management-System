// routes/patientFollowUpRoute.js
const express = require('express');
const router = express.Router();
const patientFollowUpController = require('../controllers/patientFollowUpController');

const path = 'patientsfollowup'; // URL base path

// Using similar URL structure
router.post(`/${path}/getById`, patientFollowUpController.getById);
router.post(`/${path}/getList`, patientFollowUpController.getList);
router.post(`/${path}/create`, patientFollowUpController.create);
router.post(`/${path}/update`, patientFollowUpController.update);
router.post(`/${path}/delete`, patientFollowUpController.delete);

module.exports = router;
