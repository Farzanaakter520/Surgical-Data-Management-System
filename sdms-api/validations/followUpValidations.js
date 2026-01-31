// patFollowUpSchValidator.js

exports.validateCreate = (data) => {
    const errors = [];

    // Follow-up Schedule Required Fields
    if (!data.patient_id) errors.push('patient_id is required');
    if (!data.admission_id) errors.push('admission_id is required');
    if (!data.hospital_id) errors.push('hospital_id is required');
    if (!data.doctor_id) errors.push('doctor_id is required');
    if (!data.follow_up_type_id) errors.push('follow_up_type_id is required');
    if (!data.scheduled_date) errors.push('scheduled_date is required');
    if (!data.start_time) errors.push('start_time is required');
    if (!data.visit_status) errors.push('visit_status is required');

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
