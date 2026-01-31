// ---------------- EditPatientForm.tsx ----------------
"use client";
import { useCallback } from "react";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { z } from "zod";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";

/* -------------------- VALIDATION -------------------- */
export const editPatientSchema = z.object({
    id: z.number().min(1, "Patient ID is required"),
    patient_name: z.string().min(1, "Name is required"),
    age: z.number().min(1, "Age is required"),
    gender: z.string().min(1, "Gender is required"),
    religion: z.string().min(1, "Religion is required"),
    mobile_number: z.string().min(1, "Mobile number is required"),
    address_line_one: z.string().min(1, "Address is required"),
});

export type EditPatientFormData = z.infer<typeof editPatientSchema>;

/* -------------------- DEFAULT VALUES -------------------- */
export const admissionDefaults: EditPatientFormData = {
    id: 1,
    patient_name: "Patient Name",
    age: 1,
    gender: "",
    religion: "",
    mobile_number: "",
    address_line_one: "",
}

/* -------------------- FORM COMPONENT -------------------- */
export function EditPatientForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Edit Patient</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Patient UID */}
        {/* <FormFieldController
          name="patient_generated_uid"
          label="Patient ID"
          type="numbericText"
          placeholder="Enter patient ID"
          required
          
          size="full"
        /> */}

        {/* Name */}
        <FormFieldController
          name="patient_name"
          label="Name"
          type="text"
          placeholder="Enter patient name"
          required
          size="full"
        />

        {/* Age */}
        <FormFieldController
          name="age"
          label="Age"
          type="numbericText"
          placeholder="Enter patient age"
          required
          size="half"
        />

        {/* Gender */}
        <FormFieldController
          name="gender"
          label="Gender"
          type="text"
          placeholder="Enter patient gender"
          required
          size="half"
        />

        {/* Religion */}
        <FormFieldController
          name="religion"
          label="Religion"
          type="dynamicSelect"
          componentProps={{options:useCallback(()=>fetchOptionsForEntity("religion"),[])}}
          placeholder="Enter patient religion"
          required
          size="half"
        />

        {/* Mobile Number */}
        <FormFieldController
          name="mobile_number"
          label="Mobile Number"
          type="text"
          placeholder="Enter mobile number"
          required
          size="half"
        />

        {/* Address Line One */}
        <FormFieldController
          name="address_line_one"
          label="Address Line 1"
          type="textarea"
          placeholder="Enter address line one"
          required
          size="full"
        />

      </div>
    </div>
  );
}










// "use client";
// import { useCallback } from "react";
// import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
// import { z } from "zod";

// /* -------------------- VALIDATION -------------------- */
// export const editPatientSchema = z.object({
//       // patient_id: z.string().min(1, "Patient ID is required"),
//     patient_name: z.string().min(1, "Name is required"),
//     age: z.number().min(1, "Age is required"),
//   });

// export type EditPatientFormData = z.infer<typeof editPatientSchema>;

// /* -------------------- DEFAULT VALUES -------------------- */
// export const admissionDefaults: EditPatientFormData = {
//     patient_name: "",
//     age: 1,
// }

// /* -------------------- FORM COMPONENT -------------------- */
// export function EditPatientForm() {
//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">Edit Patient</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


//         {/* Name */}
//         <FormFieldController
//           name="patient_name"
//           label="Name"
//           type="text"
//           placeholder="Enter patient name"
//           required
//           size="full"
//         />

//         {/* Age */}
//         <FormFieldController
//           name="age"
//           label="Age"
//           type="numbericText"
//           placeholder="Enter patient age"
//           required
//           size="full"
//         />
//       </div>
//     </div>
//   );
// }




// "use client";
// import { useCallback } from "react";
// import DateTimeField from "@/components/form-fields/DateTimeField";
// import TextAreaField from "@/components/form-fields/TextAreaField";
// import DynamicSelectField from "@/components/form-fields/DynamicSelectField";
// import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
// import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";

// import { z } from "zod";

// /* validations */

// export const editPatientSchema = z.object({
//    admission: z.object({
//     patient_id: z.string().min(1, "patient id is required"),
//     name: z.string().min(1, "name is required"),
//      age:z.string().min(1, "age is required"),
//   //  date_of_adm: z.string().min(1, "Admission Date is required"), // or z.date() if using Date
//     // referral_source_id: z.string().min(1, "Referred By is required"),
//     remarks: z.string().optional(),
//    }),
// });

// export type EditPatientFormData = z.infer<typeof editPatientSchema>;

// // Default values
// export const admissionDefaults: EditPatientFormData = {
//    admission:{ 
//       patient_id:"1",
//     name: "",
//     age: "",
//     // referral_source_id: "1",
//     remarks: ""
//     }
  
// };




// export  function EditPatientForm() {
  
//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold text-gray-800">Edit Pateint</h2>

//       {/* Wrap in responsive grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              {/* patient id */}
//        {/* <FormFieldController
//             name="admission.patient_id"
//             label="patient id"
//             type="hidden"
//             size="full"
//        /> */}
//         {/* Hospital */}
//         <FormFieldController
//           name="hospital_id"
//           label="Hospital"
//           type="dynamicSelect"
//           placeholder="Select hospital"
//           componentProps={{options:useCallback(()=>fetchOptionsForEntity("hospitalmaster"),[])}}
//           required
//           size="half"
//         />
         
//         {/* Admission Date */}
//         <FormFieldController
//           name="admission.date_of_adm"
//           label="Admission Date"
//           type="text"
//           placeholder="Select admission date"
//           required
         
//         />
//       {/* </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}
//         {/* Referred By */}
//         {/* <FormFieldController
//           name="admission.referral_source_id"
//           label="Referred By"
//           type="dynamicSelect"
//           placeholder="Select referral source"
//           componentProps={{options:useCallback(()=>fetchOptionsForEntity("refsource"),[])}}
//           required
         
//         /> */}

//         {/* Remarks */}
          
//             <FormFieldController
//               name="admission.remarks"
//               label="Remarks"
//               type="text"
//               placeholder="Enter remarks"
//               size="full"
//             />
//         </div>
//     </div>
//   );
// }
