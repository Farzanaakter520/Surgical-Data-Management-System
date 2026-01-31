
// patAssessmentValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Patients Required Fields
    if (!data.patient_generated_uid) errors.push('patient_generated_uid is required');
    if (!data.name) errors.push('name is required');
    if (!data.age) errors.push('age is required');
    if (!data.gender) errors.push('gender is required');
    if (!data.religion) errors.push('religion is required');
    if (!data.mobile_number) errors.push('mobile_number is required');
    if (!data.address_line_one) errors.push('address_line_one is required');

    return errors.length > 0 ? errors : null;
};

exports.validateUpdate = (data) => {
     
    const errors = [];
    return null;
    if (!data.id) errors.push('id is required');
    if (!data.name) errors.push('name is required');
    const age = Number(data.age);
    if (!age && age0) errors.push('age is required');
    if (!data.gender) errors.push('gender is required');
    if (!data.religion) errors.push('religion is required');
    if (!data.mobile_number) errors.push('mobile_number is required');
    if (!data.address_line_one) errors.push('address_line_one is required');

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
