// routes/patPreopSurgicalHist.js
const express = require('express');
const router = express.Router();
const opsController = require('../controllers/patPreopSurgicalHistController');

const path = 'patPreopSurgicalHist';

// Using similar URL structure
router.post(`/${path}/getById`, opsController.getById);
router.post(`/${path}/getList`, opsController.getList);
router.post(`/${path}/create`, opsController.create);
router.post(`/${path}/update`, opsController.update);
router.post(`/${path}/delete`, opsController.delete);

module.exports = router;
