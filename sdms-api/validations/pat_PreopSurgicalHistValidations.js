// patAssessmentValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Patient Preop Surgical History Required Fields
if (!data.patient_id) errors.push('patient_id is required');
if (!data.admission_id) errors.push('admission_id is required');
if (!data.operation_id) errors.push('operation_id is required');
if (data.has_previous_history === undefined) errors.push('has_previous_history is required');


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
