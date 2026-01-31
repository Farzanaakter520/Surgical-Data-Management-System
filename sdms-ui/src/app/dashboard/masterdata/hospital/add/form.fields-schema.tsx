"use client";

import { z } from "zod";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";

/* ------------------------------------
 * ZOD VALIDATION SCHEMA
 * ------------------------------------ */
export const hospitalSchema = z.object({
    name: z
      .string()
      .min(1, "Name is required")
      .max(100, "Name must be between 1 and 100 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Enter a valid email address"),
    address_line_1: z.string().min(1, "Address Line 1 is required"),
    address_line_2: z.string().optional(),
    contact_number: z
      .string()
      .min(1, "Contact number is required")
      .regex(/^[0-9]{11}$/, "Enter a valid 11-digit contact number"),
    alternative_contact_number: z
      .string()
      .regex(/^[+]?[0-9]{7,15}$/, "Enter a valid contact number")
      .optional(),
    website: z.string().optional(),

});

/* ------------------------------------
 * DEFAULT VALUES
 * ------------------------------------ */
export const hospitalDefaults = {
  
    name: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    contact_number: "",
    alternative_contact_number: "",
    website: "",
  
};

/* ------------------------------------
 * FORM COMPONENT
 * ------------------------------------ */
export function HospitalForm() {
  return (
    <div className="space-y-1">
      {/* <h3 className="text-lg font-semibold text-gray-900">
        Hospital / Clinic Information
      </h3> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldController
          name="name"
          label="Name"
          type="text"
          placeholder="Enter hospital/clinic name"
          required
          size="half"
        />

        <FormFieldController
          name="email"
          label="Email"
          type="text"
          placeholder="Enter hospital email"
          required
          size="half"
        />

        <FormFieldController
          name="contact_number"
          label="Contact Number"
          type="text"
          placeholder="Enter 11-digit contact number"
          required
          size="half"
        />

        <FormFieldController
          name="alternative_contact_number"
          label="Alternative Contact"
          type="text"
          placeholder="Enter alternative contact number"
          size="half"
        />

        <FormFieldController
          name="website"
          label="Website"
          type="text"
          placeholder="Enter website"
          size="half"
        />

        <FormFieldController
          name="address_line_1"
          label="Address Line 1"
          type="textarea"
          placeholder="Enter address"
          required
          size="full"
        />

        <FormFieldController
          name="address_line_2"
          label="Address Line 2"
          type="text"
          placeholder="Enter additional address (optional)"
          size="full"
        />
      </div>
    </div>
  );
}
