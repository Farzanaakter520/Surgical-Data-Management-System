// routes/investigation.js
const express = require('express');
const router = express.Router();
const invController = require('../controllers/investigationController');

const path = 'investigation';

// Using similar URL structure
router.post(`/${path}/getById`, invController.getById);
router.post(`/${path}/getList`, invController.getList);
router.post(`/${path}/create`, invController.create);
router.post(`/${path}/update`, invController.update);
router.post(`/${path}/delete`, invController.delete);

module.exports = router;
