// routes/hospitals.js
const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

const path = 'hospitals';

// Using similar URL structure as patients
router.post(`/${path}/getById`, hospitalController.getById);
router.post(`/${path}/getList`, hospitalController.getList);
router.post(`/${path}/create`, hospitalController.create);
router.post(`/${path}/update`, hospitalController.update);
router.post(`/${path}/delete`, hospitalController.delete);
router.post(`/${path}/deactivate`, hospitalController.deactivate);

module.exports = router;
