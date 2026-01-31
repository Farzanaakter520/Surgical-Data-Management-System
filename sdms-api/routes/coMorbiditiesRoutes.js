// routes/coMorbidities.js
const express = require('express');
const router = express.Router();
const opsController = require('../controllers/coMorbiditiesController');

const path = 'co-morbidities';  // Route path

// Using similar URL structure as patients
router.post(`/${path}/getById`, opsController.getById);
router.post(`/${path}/getList`, opsController.getList);
router.post(`/${path}/create`, opsController.create);
router.post(`/${path}/update`, opsController.update);
router.post(`/${path}/delete`, opsController.delete);

module.exports = router;
