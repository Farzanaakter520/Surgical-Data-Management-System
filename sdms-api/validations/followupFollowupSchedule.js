// followupFollowupSchedule.js

exports.validateCreate = (data) => {
    const errors = [];

    if (!data.followup) {
        errors.push('followup object is required');
    } else if (!data.followup.followup_schedule_id) {
        errors.push('followup.followup_schedule_id is required');
    }

    return errors.length > 0 ? errors : null;
};
