// routes/patClinicalDiag.js
const express = require('express');
const router = express.Router();
const clinicalDiagController = require('../controllers/patClinicalDiagController');

const path = 'patClinicalDiag';

// Using similar URL structure
router.post(`/${path}/getById`, clinicalDiagController.getById);
router.post(`/${path}/getList`, clinicalDiagController.getList);
router.post(`/${path}/create`, clinicalDiagController.create);
router.post(`/${path}/update`, clinicalDiagController.update);
router.post(`/${path}/delete`, clinicalDiagController.delete);

module.exports = router;
