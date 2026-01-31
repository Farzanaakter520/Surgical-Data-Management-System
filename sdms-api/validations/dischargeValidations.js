// dischargeValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Required fields for discharge
    if (!data.patient_id) errors.push('patient_id is required');
    if (!data.admission_id) errors.push('admission_id is required');
    if (!data.hospital_id) errors.push('hospital_id is required');
    if (!data.outcome) errors.push('outcome is required');

    return errors.length > 0 ? errors : null;
};

exports.validateUpdate = (data) => {
    const errors = [];
    if (!data.id) errors.push('id is required for update');
    return errors.length > 0 ? errors : null;
};

exports.validateDelete = (data) => {
    const errors = [];
    if (!data.id) errors.push('id is required for deletion');
    return errors.length > 0 ? errors : null;
};

exports.validateGetById = (data) => {
    const errors = [];
    if (!data.id) errors.push('id is required');
    return errors.length > 0 ? errors : null;
};
