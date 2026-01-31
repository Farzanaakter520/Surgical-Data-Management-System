// routes/discharge.js
const express = require('express');
const router = express.Router();
const dischargeController = require('../controllers/dischargeController');

const path = 'discharge';

// Using similar URL structure
router.post(`/${path}/getById`, dischargeController.getById);
router.post(`/${path}/getList`, dischargeController.getList);
router.post(`/${path}/create`, dischargeController.create);
router.post(`/${path}/update`, dischargeController.update);
router.post(`/${path}/delete`, dischargeController.delete);

module.exports = router;
