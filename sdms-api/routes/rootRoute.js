const express = require("express");
const ErrorHandler = require("../utils/errorHandler");
//const API_CONFIG = require('../config/apiConfig');
const testRoutes = require("./testRoute");
const drugRoutes = require("./drugRoute");
const driveRoues = require("./driveRoute");
const patientRoutes = require("./patientRoutes");
const patAdmRoutes = require("./patAdmRoutes");
const hospitalRoutes = require("./hospitalRoutes");
const referralRoutes = require("./referralRoutes");
const clinicalRoutes = require("./clinicalRoutes");
const investigationRoutes = require("./investigationRoutes");
const coMorbiditiesRoutes = require("./coMorbiditiesRoutes");
const drugHistRoutes = require("./drugHistRoute");
const operationRoutes = require("./operationRoutes");
const drugTypesRoutes = require("./drugTypesRoute");
const patClinicalDiagRoutes = require("./patClinicalDiagRoutes");
const patCoMorbiditiesRoutes = require("./patCoMorbiditiesRoute");
const designationsRoutes = require("./designationsRoute");
const patInvestigationRoutes = require("./patInvestigationRoute");
const specialtiesRoutes = require("./specialtiesRoute");
const patPreopSurgicalHistRoutes = require("./patPreopSurgicalHistRoute");
const surgicalDataRoutes = require("./surgicalDataRoute");
const preSurgicalDataRoutes = require("./preSurgicalDataRoute");
const postOpDocsRoutes = require("./postOpDocsRoute");
const optionDataRoutes = require("./optionDataRoute");
const patientDataRoutes = require("./patientDataRoute");
const patientReportsRoutes = require("./patientReportsRoute");
const occupationMasterRoutes = require("./occupationMasterRoute");
const dischargeRoutes = require("./dischargeRoute");
const followUpRoutes = require("./followUpRoutes");
const patientFollowUpRoutes = require("./patientFollowUpRoute");
const doctorsRoutes = require("./doctorsRoute");
const dashboardRoute = require("./dashboardRoute");
const registrationToPostOpRoute = require("./registrationToPostOpRoute");
const patientProfileRoute = require("./patientProfileRoute");
const dischargeFollowupRoute = require("./dischargeFollowupRoute");
const followupScheduleRoute = require("./followupScheduleRoute");
const authRoutes=require("./authRoute");
const sessionStorageRoutes=require("./sessionStorageRoute");
const admissionToPostopRoute=require("./admissionToPostopRoute");

const route = (app) => {
  app.use(express.static("public/uploads/category"));
  app.use(express.static("public/uploads/movie"));

  // Routes with global API path
  // const apiPath = API_CONFIG.FULL_PATH;
  const apiPath = "/api/v1/";
  app.use(apiPath, testRoutes);
  app.use(apiPath, drugRoutes);
  app.use(apiPath, sessionStorageRoutes);
  app.use(apiPath,authRoutes);
  app.use(apiPath, driveRoues);
  app.use(apiPath, patientRoutes);
  app.use(apiPath, patAdmRoutes);
  app.use(apiPath, hospitalRoutes);
  app.use(apiPath, referralRoutes);
  app.use(apiPath, clinicalRoutes);
  app.use(apiPath, investigationRoutes);
  app.use(apiPath, coMorbiditiesRoutes);
  app.use(apiPath, drugHistRoutes);
  app.use(apiPath, operationRoutes);
  app.use(apiPath, drugTypesRoutes);
  app.use(apiPath, patClinicalDiagRoutes);
  app.use(apiPath, patCoMorbiditiesRoutes);
  app.use(apiPath, designationsRoutes);
  app.use(apiPath, patInvestigationRoutes);
  app.use(apiPath, specialtiesRoutes);
  app.use(apiPath, patPreopSurgicalHistRoutes);
  app.use(apiPath, surgicalDataRoutes);
  app.use(apiPath, preSurgicalDataRoutes);
  app.use(apiPath, postOpDocsRoutes);
  app.use(apiPath, optionDataRoutes);
  app.use(apiPath, patientDataRoutes);
  app.use(apiPath, patientReportsRoutes);
  app.use(apiPath, occupationMasterRoutes);
  app.use(apiPath, dischargeRoutes);
  app.use(apiPath, followUpRoutes);
  app.use(apiPath, patientFollowUpRoutes);
  app.use(apiPath, doctorsRoutes);
  app.use(apiPath, dashboardRoute);
  app.use(apiPath, registrationToPostOpRoute);
  app.use(apiPath, patientProfileRoute);
  app.use(apiPath, dischargeFollowupRoute);
  app.use(apiPath, followupScheduleRoute);
  app.use(apiPath, admissionToPostopRoute);



  // Handle 404
  //app.use('/api/v1/expert-profiles', expertProfilesRoutes);

  app.all("*", (req, res, next) => {
    next(
      new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404)
    );
  });
};

module.exports = route;
