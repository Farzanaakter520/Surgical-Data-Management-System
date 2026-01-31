// validation.js
exports.validate = (data = {}) => {
  return null; // no validation
};



// // validation.js
// exports.validate = (data = {}) => {
//   const errors = [];
//   const mode = (data.action_mode || "").toLowerCase();

//   if (!mode) {
//     errors.push("action_mode is required");
//     return errors;
//   }

//   if (mode === "date_between_patient_report") {
//     const requiredFields = ["from_date", "to_date"];
//     requiredFields.forEach((field) => {
//       if (!data[field]) errors.push(`${field} is required`);
//     });

//    /* validations of insert */

//   } 
//   else if (mode === "update") {
//     const requiredFields = ["id"];
//     requiredFields.forEach((field) => {
//       if (!data[field]) errors.push(`${field} is required`);
//     });
//    /* other validations of update */
//   } 
//   else if (mode === "delete") {
//     if (!data.id) errors.push("id is required for deletion");
//   } 
//   else if (mode === "getbyid") {
//     if (!data.id) errors.push("id is required");
//   }
//   else {
//     errors.push(`Unknown action_mode: ${mode}`);
//   }

//   return errors.length > 0 ? errors : null;
// };
