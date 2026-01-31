// routes/patAdm.js
const express = require("express");
const router = express.Router();
const patAdmController = require("../controllers/patAdmController");

const path = "patAdm";

// Using similar URL structure
router.post(`/${path}/getById`, patAdmController.getById);
router.post(`/${path}/getList`, patAdmController.getList);
router.post(`/${path}/create`, patAdmController.create);
router.post(`/${path}/update`, patAdmController.update);
router.post(`/${path}/delete`, patAdmController.delete);

module.exports = router;
