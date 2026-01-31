// routes/specialties.js
const express = require('express');
const router = express.Router();
const specialtiesController = require('../controllers/specialtiesController');

const path = 'specialties';

// Using similar URL structure
router.post(`/${path}/getById`, specialtiesController.getById);
router.post(`/${path}/getList`, specialtiesController.getList);
router.post(`/${path}/create`, specialtiesController.create);
router.post(`/${path}/update`, specialtiesController.update);
router.post(`/${path}/delete`, specialtiesController.delete);

module.exports = router;
