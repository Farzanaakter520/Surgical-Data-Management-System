// ---------------- EditPatient.tsx ----------------
"use client";

import React, { useCallback, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import PortalModal from "@/components/utility-components/portal-modal";
import { useSmartForm } from "@/hooks/useSmartForm";
import { ActionButton, ActionButtons } from "@/components/utility-components/ActionButtons";
import { EditPatientForm, editPatientSchema, admissionDefaults } from "@/app/a-reusable-form-page-components/editPatientForm";
import { useFormDebug } from "@/hooks/use-form-debug";
import { PatientBasicCard } from "@/app/a-project-components/patient-basic-card";

interface EditPatientProps {
  open: boolean;
  parentDataProps?: any;
  onClose: () => void;
  onModalComplete?: (data: any) => void;
}

export const EditPatient = ({
  open,
  parentDataProps,
  onClose,
  onModalComplete,
}: EditPatientProps) => {

  /* -------------------- DATA PREP BEFORE SUBMIT -------------------- */
  const prepData = (data: any) => {
    const finalData = {
      id: parentDataProps?.patient_id,
      ...data,
      action_mode: "update"
    };
    console.log("Final Edit Data:", finalData);
    return finalData;
  };

  /* -------------------- SMART FORM SETUP -------------------- */
  const { form, formRef, handleSubmit, isFormLoading, handleReset, populateFormData } = useSmartForm({
    schema: editPatientSchema,
    formConfig: {
      service: "sdms",
      urls: { SAVE: "/patients/update" },
    },
    defaultValues: admissionDefaults, // ✅ default values
    initialData: parentDataProps,     // ✅ populate existing patient data
    onBeforeSubmit: async (data) => prepData(data),
  });
  
  const { DebugButton } = useFormDebug(form);

  /* -------------------- ON SUBMIT -------------------- */
  const onSubmit = async (data: any) => {
    const success = await handleSubmit(data, {
      resetAfterSubmit: true,
      successMessage: "Patient updated successfully!",
      resetFocusField: "patient_name",
    });

    if (success) {
      onModalComplete?.(data);
      onClose();
    }
  };

  /* -------------------- BUTTON HANDLER -------------------- */
  // const handleComplete = useCallback(() => {
  //   const values = form.getValues();
  //   console.log("Submitting Values:", values);
  //   onSubmit(values);
  // }, [form]);


  /* -------------------- BUTTON HANDLER -------------------- */
const handleComplete = useCallback(() => {
  form.handleSubmit(async (data) => {
    await onSubmit(data);
  })();
}, [form, onSubmit]);


  const onPortalClose = () => onClose();

  const isSubmitEnabled = form.formState.isValid && !isFormLoading && open === true;

  /* -------------------- POPULATE FORM WHEN MODAL OPENS -------------------- */
  useEffect(() => {
    if (open && parentDataProps) {
      console.log("parentDataProps", parentDataProps);
      populateFormData(parentDataProps, "patient_name");
      form.setValue("id",parentDataProps.patient_id);
    }
  }, [open, parentDataProps, populateFormData]);

  /* -------------------- UI -------------------- */
  return (
    <PortalModal
      title="Edit Patient"
      isOpen={open}
      onClose={onPortalClose}
      maxWidth="max-w-4xl"
    >
      <FormProvider {...form}>
        {parentDataProps && <PatientBasicCard patient={parentDataProps} />}

        {/* Actual form fields */}
        <EditPatientForm />

        {/* Debug Button */}
        <DebugButton />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6 border-t pt-4">
          <ActionButtons>
            <ActionButton
              variant="primary"
              disabled={!isSubmitEnabled}
              loading={isFormLoading}
              onClick={handleComplete}
            >
              Save
            </ActionButton>

            <ActionButton variant="reset" onClick={() => handleReset()}>
              Reset
            </ActionButton>

            <ActionButton variant="cancel" onClick={onPortalClose}>
              Cancel
            </ActionButton>
          </ActionButtons>
        </div>
      </FormProvider>
    </PortalModal>
  );
};











// "use client";

// import React, { useCallback, useEffect } from "react";
// import { FormProvider } from "react-hook-form";
// import PortalModal from "@/components/utility-components/portal-modal";
// import { useSmartForm } from "@/hooks/useSmartForm";
// import { ActionButton, ActionButtons } from "@/components/utility-components/ActionButtons";
// import { useFormDebug } from "@/hooks/use-form-debug";
// import { EditPatientForm, editPatientSchema, admissionDefaults } from "@/app/a-reusable-form-page-components/editPatientForm";
// import { PatientBasicCard } from "@/app/a-project-components/patient-basic-card";

// interface EditPatientProps {
//   open: boolean;
//   parentDataProps?: any;
//   onClose: () => void;
//   onModalComplete?: (data: any) => void;
// }

// export const EditPatient = ({
//   open,
//   parentDataProps,
//   onClose,
//   onModalComplete,
// }: EditPatientProps) => {

//   /* -------------------- DATA PREP BEFORE SUBMIT -------------------- */
//   const prepData = (data: any) => {
//     const finalData = {patient_id: parentDataProps?.patient_id,
//       ...data,aciton_mode: "update"};
//     console.log("Final Edit Data:", finalData);
//     return finalData;
//   };

//   /* -------------------- SMART FORM SETUP -------------------- */
//   const { form, formRef, handleSubmit, isFormLoading, handleReset, populateFormData } = useSmartForm({
//     schema: editPatientSchema,
//     formConfig: {
//       service: "sdms",
//       urls: { SAVE: "/patients/update" },
//     },
//     defaultValues: admissionDefaults, // ✅ default values
//     initialData: parentDataProps,     // ✅ populate existing patient data
//     onBeforeSubmit: async (data) => prepData(data),
//   });

//   const { DebugButton } = useFormDebug(form);

//   /* -------------------- ON SUBMIT -------------------- */
//   const onSubmit = async (data: any) => {
//     const success = await handleSubmit(data, {
//       resetAfterSubmit: true,
//       successMessage: "Patient updated successfully!",
//       resetFocusField: "patient_name",
//     });

//     if (success) {
//       onModalComplete?.(data);
//       onClose();
//     }
//   };

//   /* -------------------- BUTTON HANDLER -------------------- */
//   const handleComplete = useCallback(() => {
//     const values = form.getValues();
//     console.log("Submitting Values:", values);
//     onSubmit(values);
//   }, [form]);

//   const onPortalClose = () => onClose();

//   const isSubmitEnabled = form.formState.isValid && !isFormLoading && open === true;

//   /* -------------------- POPULATE FORM WHEN MODAL OPENS -------------------- */
//   useEffect(() => {
//     if (open && parentDataProps) {
//       console.log("parentDataProps",parentDataProps);
//       populateFormData(parentDataProps,"patient_name");
//     }
//   }, [open, parentDataProps, populateFormData]);

//   /* -------------------- UI -------------------- */
//   return (
//     <PortalModal
//       title="Edit Patient"
//       isOpen={open}
//       onClose={onPortalClose}
//       maxWidth="max-w-4xl"
//     >
//       <FormProvider {...form}>
//         {parentDataProps && <PatientBasicCard patient={parentDataProps} />}

//         {/* Actual form fields */}
//         <EditPatientForm />

//         {/* Debug Button */}
//         {/* <DebugButton /> */}

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 mt-6 border-t pt-4">
//           <ActionButtons>
//             <ActionButton
//               variant="primary"
//               disabled={!isSubmitEnabled}
//               loading={isFormLoading}
//               onClick={handleComplete}
//             >
//               Save
//             </ActionButton>

//             <ActionButton variant="reset" onClick={() => handleReset()}>
//               Reset
//             </ActionButton>

//             <ActionButton variant="cancel" onClick={onPortalClose}>
//               Cancel
//             </ActionButton>
//           </ActionButtons>
//         </div>
//       </FormProvider>
//     </PortalModal>
//   );
// };




// "use client";

// import React, { useCallback, useEffect } from "react";
// import { useTransition } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { BarChart3 } from "lucide-react";
// import PortalModal from "@/components/utility-components/portal-modal";
// // import {
// //   DischargeForm,
// //   dischargeSchema,
// //   DischargeFormData,
// // } from "@/app/a-reusable-form-page-components/editPatientForm";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   FollowUpScheduleForm,
//   followUpScheduleSchema,
// } from "@/app/a-reusable-form-page-components/followupScheduleForm";
// import { submitForm, ActionResponse } from "@/lib/actions/formServerActions"; // Update the import path
// import {
//   ActionButton,
//   ActionButtons,
// } from "@/components/utility-components/ActionButtons";
// import { useSmartForm } from "@/hooks/useSmartForm";
// import { PatientBasicCard } from "@/app/a-project-components/patient-basic-card";
// import { useFormDebug } from "@/hooks/use-form-debug";
// import { DischargeForm, dischargeSchema } from "@/app/a-reusable-form-page-components/dischargeForm";

// interface ReleaseFollowupScheduleProps {
//   open: boolean;
//   parentDataProps?: any;
//   onClose: () => void;
//   onModalComplete?: (data: any) => void;
// }

// // Create a combined schema type
// type CombinedFormData = z.infer<typeof dischargeSchema> &
//   z.infer<typeof followUpScheduleSchema>;

// export const EditPatient = ({
//   open,
//   parentDataProps,
//   onClose,
//   onModalComplete,
// }: ReleaseFollowupScheduleProps) => {
//   // Create proper combined schema
//   const schema = z
//     .object({
//       discharge: dischargeSchema.shape.discharge,
//       followup_schedule: z.object({}).catchall(z.any()).optional(),
//     })
//     .superRefine((data, ctx) => {
//       if (data.discharge.follow_up_required) {
//         const followUpScheduleResult = followUpScheduleSchema.safeParse(data);
//         if (!followUpScheduleResult.success) {
//           followUpScheduleResult.error.issues.forEach((issue) => {
//             // ✅ Correct property
//             ctx.addIssue({
//               ...issue,
//               path: issue.path,
//             });
//           });
//         }
//       }
//     });

//   const { form, formRef, handleSubmit, isFormLoading, handleReset } =
//     useSmartForm({
//       schema: schema,
//       formConfig: {
//         service: "sdms",
//         urls: { SAVE: "/discharge-followup/handle" },
//       },
//       onBeforeSubmit: async (data) => prepData(data),
//       // defaultValues: {
//       //   discharge: {
//       //     follow_up_required: false, // Default to false
//       //     // other default values...
//       //   },
//       //   follow_up: followUpDefaults.follow_up
//       // },
//     });

//   const { DebugButton } = useFormDebug(form);

//   const followRequired = form.watch("discharge.follow_up_required");

//   // Enhanced prepData function
//   const prepData = (data: any) => {
//     console.log("Preparing data:", data);
//     console.log("parent data props :", parentDataProps);

//     const finalData = {
//       patient_id: parentDataProps.patient_id,
//       admission_id: parentDataProps.admission_id,
//       hospital_id: parentDataProps.hospital_id,
//       discharge: { ...data.discharge, action_mode: "insert" },
//       followup_schedule: { ...data.followup_schedule, action_mode: "insert" },
//     };
    
//     // If follow-up is not required, clear follow-up data
//     if (!data.discharge.follow_up_required) {
//       return { ...finalData, followup: null };
//     }

//     console.log(finalData);
//     return finalData;
//   };

//   const onSubmit = async (data: any) => {
//     //  console.log("from on submit ", data);
//     const success = await handleSubmit(data, {
//       resetAfterSubmit: true,
//       successMessage: "Release and schedule Successfully created!",
//       resetFocusField: "discharge_date_time",
//     });
//     // console.log(success)
//     if (success) {
//       onModalComplete?.(data);
//       onClose();
//     }
//   };

//   const onPortalClose = () => {
//     onClose();
//   };

//   const handleComplete = useCallback(() => {
//     const values = form.getValues();
//     console.log("Form values:", values);
//     console.log("Discharge data:", values.discharge);
//     console.log("Follow-up data:", values.followup_schedule);
//     onSubmit(values);
//   }, [form, onSubmit]);

//   // Determine if action button should be enabled
//   const isSubmitEnabled = (() => {
//     // Basic form validation
//     const isDischargeValid = form.formState.isValid;

//     // If follow-up is required, check if follow-up form has errors
//     if (followRequired) {
//       const followUpValues = form.getValues("followup_schedule");
//       const hasFollowUpErrors =
//         Object.keys(form.formState.errors.followup_schedule || {}).length > 0;
//       const isFollowUpFilled =
//         followUpValues &&
//         followUpValues.doctor_id &&
//         followUpValues.scheduled_date &&
//         followUpValues.follow_up_type_id;

//       return isDischargeValid && !hasFollowUpErrors && isFollowUpFilled;
//     }

//     // If follow-up not required, only check discharge form
//     return isDischargeValid;
//   })();

//   return (
//     <PortalModal
//       title="Edit Patient"
//       isOpen={open}
//       onClose={onPortalClose}
//       maxWidth="max-w-6xl"
//     >
//       <FormProvider {...form}>
//         {parentDataProps && <PatientBasicCard patient={parentDataProps} />}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
//           {/* Discharge Form */}
//           <div className="space-y-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Patient Information
//             </h3>
//             <DischargeForm />
//           </div>

        
//         </div>

//         {/* <DebugButton/> */}

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-4 mt-1 pt-1 border-t mb-3">
//           <ActionButtons>
//             <ActionButton
//               variant="primary"
//               disabled={!isSubmitEnabled || isFormLoading}
//               loading={isFormLoading}
//               onClick={handleComplete}
//             >
//               Save
//             </ActionButton>
//             <ActionButton
//               variant="reset"
//               onClick={() => {
//                 handleReset("hello");
//               }}
//             >
//               Reset
//             </ActionButton>
//             <ActionButton variant="cancel" onClick={onPortalClose}>
//               Cancel
//             </ActionButton>
//           </ActionButtons>
//         </div>
//       </FormProvider>
//     </PortalModal>
//   );
// };