// routes/patientProfile.js
const express = require("express");
const router = express.Router();
const profileController = require("../controllers/patientProfileController");

const path = "patientProfile";

// Using similar URL structure
router.post(`/${path}/getProfile`, profileController.getProfile);

module.exports = router;
