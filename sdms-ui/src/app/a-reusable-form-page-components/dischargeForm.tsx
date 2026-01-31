"use client";
import { useCallback } from "react";
import DateTimeField from "@/components/form-fields/DateTimeField";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import RadioField from "@/components/form-fields/RadioField"
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { z } from "zod";

/* validations */
export const dischargeSchema = z.object({
  discharge: z.object({
    discharge_date_time: z.string().nonempty("Discharge date & time is required"),
    advice_on_discharge: z.string().nonempty("Advice on discharge is required"),
    follow_up_procedure: z.array(z.string()).optional(), // Multi-select
    outcome: z.string().nonempty("Outcome is required"),
    follow_up_required: z.boolean().default(true)
  }),
});

export type DischargeFormData = z.infer<typeof dischargeSchema>;

// Default values
export const dischargeDefaults: DischargeFormData = {
  discharge: {
    discharge_date_time: "",
    advice_on_discharge: "",
    follow_up_procedure: [],
    outcome: "",
    follow_up_required:true,
  },
};


export  function DischargeForm() {
  return (
    <div className="space-y-4">
      {/* <h2 className="text-xl font-semibold text-gray-800">Discharge</h2> */}

      {/* Discharge Date & Time */}
      <FormFieldController
        name="discharge.discharge_date_time"
        label="Discharge Date & Time"
        type="datetime"
        placeholder="Select discharge date & time" 
        required
      />

      {/* Advice on Discharge */}
      <FormFieldController
        name="discharge.advice_on_discharge"
        label="Advice on Discharge"
        type="textarea"
        placeholder="Enter advice on discharge" 
        required
      />

      {/* <TextAreaField
        name="discharge.advice_on_discharge"
        label="Advice on Discharge"
        placeholder="Enter advice on discharge"
      /> */}

      {/* F/U Procedure */}
      <FormFieldController
        name="discharge.follow_up_procedure"
        label="F/U Procedure"
        type="multiSelect"
        placeholder="Enter advice on discharge" 
        required
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("operationmaster"),[])}}
      />
 

      {/* Outcome */}
      <FormFieldController
        name="discharge.outcome"
        label="Outcome"
        type="radio"
        required
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("outcome"),[])}}
      />
      <FormFieldController
        name="discharge.follow_up_required"
        label="Followup Required?"
        type="checkbox"
        required
        componentProps={{
          label: "Yes, Followup Required",
        }}
      />


    </div>
  );
}
