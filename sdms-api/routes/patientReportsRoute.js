// // routes/patientReports.js
// const express = require('express');
// const router = express.Router();
// const patientReportController = require('../controllers/patientReportController');

// const path = 'patientsReports';

// // Using similar URL structure
// router.post(`/${path}/getpatientdata`, patientReportController.getPatientReport);

// module.exports = router;

const express = require('express');
const router = express.Router();
const patientReportController = require('../controllers/patientReportController');

const path = 'patientsReports';

// Preserve the same pattern
router.post(`/${path}/getpatientdata`, patientReportController.getPatientReport);

module.exports = router;
