"use client";
import { useCallback } from "react";
import DateTimeField from "@/components/form-fields/DateTimeField";
import TextAreaField from "@/components/form-fields/TextAreaField";
import DynamicSelectField from "@/components/form-fields/DynamicSelectField";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";

import { z } from "zod";

/* validations */

export const admissionSchema = z.object({
   admission: z.object({
    hospital_id: z.string().min(1, "Hospital is required"),
     patient_id:z.string().min(1, "Patient Id is required"),
    date_of_adm: z.string().min(1, "Admission Date is required"), // or z.date() if using Date
    // referral_source_id: z.string().min(1, "Referred By is required"),
    remarks: z.string().optional(),
   }),
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;

// Default values
export const admissionDefaults: AdmissionFormData = {
   admission:{ 
      patient_id:"1",
    hospital_id: "",
    date_of_adm: "",
    // referral_source_id: "1",
    remarks: ""
    }
  
};




export  function AdmissionForm() {
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Admission</h2>

      {/* Wrap in responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* patient id */}
       {/* <FormFieldController
            name="admission.patient_id"
            label="patient id"
            type="hidden"
            size="full"
       /> */}
        {/* Hospital */}
        <FormFieldController
          name="admission.hospital_id"
          label="Hospital"
          type="dynamicSelect"
          placeholder="Select hospital"
          componentProps={{options:useCallback(()=>fetchOptionsForEntity("hospitalmaster"),[])}}
          required
          size="half"
        />
         
        {/* Admission Date */}
        <FormFieldController
          name="admission.date_of_adm"
          label="Admission Date"
          type="datetime"
          placeholder="Select admission date"
          required
         
        />
      {/* </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
        {/* Referred By */}
        {/* <FormFieldController
          name="admission.referral_source_id"
          label="Referred By"
          type="dynamicSelect"
          placeholder="Select referral source"
          componentProps={{options:useCallback(()=>fetchOptionsForEntity("refsource"),[])}}
          required
         
        /> */}

        {/* Remarks */}
          
            <FormFieldController
              name="admission.remarks"
              label="Remarks"
              type="text"
              placeholder="Enter remarks"
              size="full"
            />
        </div>
    </div>
  );
}
