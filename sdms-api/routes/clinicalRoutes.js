// routes/clinicalDiagnosis.js
const express = require('express');
const router = express.Router();
const clinicalController = require('../controllers/clinicalController'); // controller path

const path = 'clinicalDiagnosis';

// Using similar URL structure as patients
router.post(`/${path}/getById/:id`, clinicalController.getById);
router.post(`/${path}/getList`, clinicalController.getList);
router.post(`/${path}/create`, clinicalController.create);
router.post(`/${path}/update/:id`, clinicalController.update);
router.post(`/${path}/delete/:id`, clinicalController.delete);
router.post(`/${path}/deactivate/:id`, clinicalController.deactivate);

module.exports = router;
