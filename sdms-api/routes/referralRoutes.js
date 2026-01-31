// routes/referralMaster.js
const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralsController'); // controller path

const path = 'referralMaster';

// Using similar URL structure as patients
router.post(`/${path}/getById`, referralController.getById);
router.post(`/${path}/getList`, referralController.getList);
router.post(`/${path}/create`, referralController.create);
router.post(`/${path}/update`, referralController.update);
router.post(`/${path}/delete`, referralController.delete);
router.post(`/${path}/deactivate`, referralController.deactivate);

module.exports = router;
