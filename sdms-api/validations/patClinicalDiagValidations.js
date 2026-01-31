// patAssessmentValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Patient Clinical Diagnosis Required Fields
if (!data.patient_id) errors.push('patient_id is required');
if (!data.admission_id) errors.push('admission_id is required');
if (!data.clinical_diag_id) errors.push('clinical_diag_id is required');


    return errors.length > 0 ? errors : null;
};

exports.validateUpdate = (data) => {
    const errors = [];
    if (!data.assess_id) errors.push('assess_id is required for update');
    return errors.length > 0 ? errors : null;
};

exports.validateDelete = (data) => {
    const errors = [];
    if (!data.assess_id) errors.push('assess_id is required for deletion');
    return errors.length > 0 ? errors : null;
};

exports.validateGetById = (data) => {
    const errors = [];
    if (!data.assess_id) errors.push('assess_id is required');
    return errors.length > 0 ? errors : null;
};
