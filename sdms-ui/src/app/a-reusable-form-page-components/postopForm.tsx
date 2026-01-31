"use client";
import { useCallback } from "react";
import DateTimeField from "@/components/form-fields/DateTimeField";
import TextAreaField from "@/components/form-fields/TextAreaField";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import RadioField from "@/components/form-fields/RadioField";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { z } from "zod";

/* validations */
export const postOpSchema = z.object({
  postop: z.object({
    // If operation_date_time is required per your config:
    operation_date_time: z.string().min(1, "Operation Date & Time is required"), 
  //    advice_on_discharge: z.string().optional().nullable(), 
    // Multi-select of operation ids
     operation_id: z.array(z.string()).optional().default([]),
     nature_of_anaesthesia: z.string().optional().nullable(),
     procedure_notes: z.string().optional().nullable(),
     challenges_during_surgery: z.string().optional().nullable(),
     post_operative_recovery_status: z.string().optional().nullable(),
     complications: z.string().optional().nullable(),
     post_op_recovery_notes: z.string().optional().nullable()
  })
});

export type PostOpFormData = z.infer<typeof postOpSchema>;

// Default values



/* UI  design*/


export  function PostopForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Postoperative</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {/* Name of Surgery */}
          <FormFieldController
            name="postop.operation_id"
            label="Name of Surgery"
            type="multiSelect"
            componentProps={{options:useCallback(()=>fetchOptionsForEntity("operationmaster"),[])}}
            required
            size="full"
          />

      {/* Discharge Date & Time */}
      <FormFieldController
        name="postop.operation_date_time"
        label="Surgery Date & Time"
        type="datetime"
        placeholder="Select surgery date & time"
        required
      />

     

      
      {/* Nature of Anaesthesia */}
      <FormFieldController
        name="postop.nature_of_anaesthesia"
        label="Nature of Anaesthesia"
        type="radio"
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("anesthesiatype"),[])}}
       />
      
      {/* Finding & Procedure Notes */}
      <FormFieldController
        name="postop.procedure_notes"
        label="Finding & Procedure Notes"
        type="textarea"
        placeholder="Enter notes"
        size="full"
      />

      {/* Challenges during Surgery */}
      <FormFieldController
        name="postop.challenges_during_surgery"
        label="Challenges during Surgery"
        type="textarea"
        placeholder="Enter challenges"
        size="full"
      />

      {/* Post Operative Recovery Status */}
      <FormFieldController
        name="postop.post_operative_recovery_status"
        label="Post Operative Recovery Status"
        type="radio"
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("postoprecoverystatus"),[])}}
     />

      {/* Complications */}
      <FormFieldController
        name="postop.complications"
        label="Complications"
        type="radio"
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("complicationstatus"),[])}}
 
       />

      {/* Post-operative Recovery Notes */}
      <FormFieldController
        name="postop.post_op_recovery_notes"
        label="Post-operative Recovery Notes"
        type="textarea"
        placeholder="Enter recovery notes"
        size="full"
      />
    </div>
    </div>
  );
}
