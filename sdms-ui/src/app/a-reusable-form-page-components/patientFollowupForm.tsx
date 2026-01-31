"use client";
import { useCallback } from "react";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";
import { z } from "zod";

/* ==============================
   Zod Schema for Followup Form
================================= */
export const patientFollowupSchema = z.object({
  followup: z.object({
    procedure_id: z.array(z.string()).optional(), // Multi-select
    notes: z.string().optional(),
    status: z.string().nonempty("Followup status is required"),
    follow_up_schedule_required: z.boolean().default(true)
  }),
});

export type FollowupFormData = z.infer<typeof patientFollowupSchema>;

/* ==============================
   Default Values
================================= */
export const followupDefaults: FollowupFormData = {
  followup: {
    procedure_id: [],
    notes: "",
    status: "",
    follow_up_schedule_required:true,
  },
};

/* ==============================
   Followup Form Component
================================= */
export function PatientFollowupForm() {
  return (
    <div className="space-y-4">
      {/* F/U Procedure */}
      <FormFieldController
        name="followup.procedure_id"
        label="F/U Procedure"
        type="multiSelect"
        placeholder="Select followup procedure"
        componentProps={{
          options: useCallback(() => fetchOptionsForEntity("operationmaster"), []),
        }}
      />

      {/* Followup Notes */}
      <FormFieldController
        name="followup.notes"
        label="Followup Notes"
        type="textarea"
        placeholder="Enter followup notes"
      />

      {/* Followup Status */}
      <FormFieldController
        name="followup.status"
        label="F/U Received Status"
        type="radio"
        required
        componentProps={{
          options: useCallback(() => fetchOptionsForEntity("followupreceived"), []),
        }}
      />
      <FormFieldController
              name="followup.follow_up_schedule_required"
              label="Followup Required?"
              type="checkbox"
              required
              componentProps={{
                label: "Yes, Next Followup Required",
              }}
            />
    </div>
  );
}
