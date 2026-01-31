// routes/patCoMorbidities.js
const express = require('express');
const router = express.Router();
const coMorbiditiesController = require('../controllers/patCoMorbiditiesController');

const path = 'patCoMorbidities';

// Using similar URL structure
router.post(`/${path}/getById`, coMorbiditiesController.getById);
router.post(`/${path}/getList`, coMorbiditiesController.getList);
router.post(`/${path}/create`, coMorbiditiesController.create);
router.post(`/${path}/update/:id`, coMorbiditiesController.update); // id use korbo update e
router.post(`/${path}/delete`, coMorbiditiesController.delete);

module.exports = router;
