"use client";
import { useCallback } from "react";
import DateTimeField from "@/components/form-fields/DateTimeField";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import RadioField from "@/components/form-fields/RadioField";
import SelectField from "@/components/form-fields/SelectField";
import TextAreaField from "@/components/form-fields/TextAreaField";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { z } from "zod";

/* validations */
/* validations */
export const followUpScheduleSchema = z
  .object({
    followup_schedule: z.object({
      doctor_id: z.string().nonempty("Doctor is required"),
      scheduled_date: z.string().nonempty("Follow-up date is required"),
      start_time: z.string().optional(),
      end_time: z.string().optional(),
      follow_up_type_id: z.string().nonempty("Follow-up type is required"),
      notes: z.string().optional(),
    }),
  })
  .refine(
    (data) => {
      const { start_time, end_time } = data.followup_schedule;
      if (!start_time || !end_time) return true; // skip if one is missing

      // Compare as times
      const start = new Date(`1970-01-01T${start_time}:00`);
      const end = new Date(`1970-01-01T${end_time}:00`);

      return end > start;
    },
    {
      message: "End time must be later than start time",
      path: ["followup_schedule", "end_time"], // error will show on end_time field
    }
  );

export type FollowUpScheduleFormData = z.infer<typeof followUpScheduleSchema>;

// Default values
export const followUpDefaults: FollowUpScheduleFormData = {
  followup_schedule: {
    doctor_id: "",
    scheduled_date: "",
    start_time: "",
    end_time: "",
    follow_up_type_id: "",
    notes: "",
  },
};

export function FollowUpScheduleForm() {
  return (
    <div className="space-y-4">
      {/* <h2 className="text-xl font-semibold text-gray-800">Patient Schedule</h2> */}
      {/* <p className="text-gray-600">Set patient follow-up or appointment schedules</p> */}

      {/* Doctor */}
      <FormFieldController
        name="followup_schedule.doctor_id"
        label="Doctor"
        type="select"
        placeholder="Select doctor"
        required
        componentProps={{ options: useCallback(() => fetchOptionsForEntity("doctormaster"), []) }}
      />

      {/* Follow-up Date */}
      <FormFieldController
        name="followup_schedule.scheduled_date"
        label="Follow-up Date"
        type="date"
        placeholder="Select follow-up date"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Start Time */}
        <FormFieldController
          name="followup_schedule.start_time"
          label="Follow-up Start Time"
          type="time"
          placeholder="Select start time"
        />

        {/* End Time */}
        <FormFieldController
          name="followup_schedule.end_time"
          label="Follow-up End Time"
          type="time"
          placeholder="Select end time"
        />
      </div>

      {/* Follow-up Type */}
      <FormFieldController
        name="followup_schedule.follow_up_type_id"
        label="Follow-up Type"
        type="radio"
        placeholder="Select follow-up type"
        required
        componentProps={{ options: useCallback(() => fetchOptionsForEntity("followuptypes"), []) }}
      />

      {/* Notes */}
      <FormFieldController
        name="followup_schedule.notes"
        label="Notes"
        type="textarea"
        placeholder="Enter any remarks"
      />

      
    </div>
  );
}