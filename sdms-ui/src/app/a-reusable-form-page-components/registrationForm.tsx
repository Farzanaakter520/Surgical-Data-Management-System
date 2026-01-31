"use client";
import { useCallback } from "react";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";
import { z } from "zod";

/* validations */
// patient-registration-schema.ts
export const patientRegistrationSchema = z.object({
  registration: z.object({
    // id: z.number().optional().nullable(),
    name: z.string().min(1, "Name is required").max(50, "Name must be 200 characters or less"),
    age: z.number().min(0, "Age must be 0 or greater").max(120, "Age must be 120 or less"),
    gender: z.string().min(1, "Gender is required"),
    occupation: z.string().optional().nullable(),
    mobile_number: z.string().regex(/^[0-9]{11}$/, "Enter a valid 11-digit mobile number"),
    religion: z.string().min(1, "Religion is required"),
    marital_status: z.string().optional().nullable(),
    referral_source_id: z.string().min(1, "Referred By is required"),
    address_line_one: z.string().min(1, "Address is required"),
  })
});

export type PatientRegistrationFormData = z.infer<typeof patientRegistrationSchema>;

/* UI design*/

export function PatientRegistrationForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <FormFieldController
          name="registration.name"
          label="Name"
          type="text"
          placeholder="Enter patient's name"
          required
          />

        {/* Age */}
        <FormFieldController
          name="registration.age"
          label="Age"
          type="numbericText"
          placeholder="Enter age"
          required
          />

        {/* Gender */}
        <FormFieldController
          name="registration.gender"
          label="Gender"
          type="radio"
          componentProps={{
            options: useCallback(() => fetchOptionsForEntity("gender"), []),
            default_value: "M"
          }}
          required
        />

        {/* Religion */}
        <FormFieldController
          name="registration.religion"
          label="Religion"
          type="radio"
          componentProps={{
            options: useCallback(() => fetchOptionsForEntity("religion"), []),
            default_value: "I"
          }}
          required
        />

        {/* Occupation */}
        <FormFieldController
          name="registration.occupation"
          label="Occupation"
          type="dynamicSelect"
          componentProps={{
            options: useCallback(() => fetchOptionsForEntity("occupation"), [])
          }}
        />

        {/* Marital Status */}
        <FormFieldController
          name="registration.marital_status"
          label="Marital Status"
          type="radio"
          componentProps={{
            options: useCallback(() => fetchOptionsForEntity("maritalstatus"), []),
            default_value: "M"
          }}
        />

        {/* Mobile Number */}
        <FormFieldController
          name="registration.mobile_number"
          label="Mobile Number"
          type="text"
          placeholder="Enter mobile number"
          required
          
        />

        {/* Referred By */}
        <FormFieldController
          name="registration.referral_source_id"
          label="Referred By"
          type="select"
          componentProps={{
            options: useCallback(() => fetchOptionsForEntity("refsource"), [])
          }}
          required
        />

        {/* Address - Full width */}
       
          <FormFieldController
            name="registration.address_line_one"
            label="Address"
            type="textarea"
            placeholder="Enter address"
            required
            size="full"
          />
        
      </div>
    </div>
  );
}
