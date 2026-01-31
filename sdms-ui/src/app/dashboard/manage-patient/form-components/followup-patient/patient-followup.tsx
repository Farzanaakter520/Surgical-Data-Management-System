"use client";

import React, { useCallback } from "react";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PortalModal from "@/components/utility-components/portal-modal";
import { PatientFollowupForm, patientFollowupSchema, followupDefaults } from "@/app/a-reusable-form-page-components/patientFollowupForm";
import { FollowUpScheduleForm,followUpScheduleSchema} from "@/app/a-reusable-form-page-components/followupScheduleForm";


import { useSmartForm } from "@/hooks/useSmartForm";
import { PatientBasicCard } from "@/app/a-project-components/patient-basic-card";
import { ActionButton, ActionButtons } from "@/components/utility-components/ActionButtons";
import { useFormDebug } from "@/hooks/use-form-debug";

interface PatientFollowupProps {
  open: boolean;
  parentDataProps?: any;
  onClose: () => void;
  onModalComplete?: (data: any) => void;
}

const combinedSchema = z
    .object({
      followup: patientFollowupSchema.shape.followup,
      followup_schedule: z.object({}).catchall(z.any()).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.followup.follow_up_schedule_required) {
        const followUpScheduleResult = followUpScheduleSchema.safeParse(data);
        if (!followUpScheduleResult.success) {
           followUpScheduleResult.error.issues.forEach((err) => {
            ctx.addIssue({
              ...err,
              path: err.path,
            });
          });
        }
      }
    });
// Schema alias
type FormData = z.infer<typeof combinedSchema>;

export const PatientFollowup = ({
  open,
  parentDataProps,
  onClose,
  onModalComplete,
}: PatientFollowupProps) => {
  // Setup form with smart form hook
  const { form, formRef, handleSubmit, isFormLoading, handleReset } =
    useSmartForm<any>({
      schema: combinedSchema,
      formConfig: {
        service: "sdms",
        urls: { SAVE: "/followup-schedule/create" },
      },
      onBeforeSubmit: async (data) => prepData(data),
      defaultValues: followupDefaults
    });

    const {DebugButton}=useFormDebug(form);
    // useFormDebug(form);
  // Data preprocessing before submit
  const prepData = (data: FormData) => {
     console.log("Preparing data:", data);
    console.log("parent data props :", parentDataProps);
   
    const final_data = {
      patient_id: parentDataProps.patient_id,
      admission_id: parentDataProps.admission_id,
      hospital_id: parentDataProps.hospital_id,
      followup: { ...data.followup,followup_schedule_id:parentDataProps?.followup_schedule_id, action_mode: "insert" },
      followup_schedule: { ...data.followup_schedule, action_mode: "insert" },
    };
    // If follow-up is not required, clear follow-up data
    if (!data.followup.follow_up_schedule_required) {
      return { ...final_data, followup_schedule: null };
      // return {
      //   discharge: data.discharge,
      //   follow_up: null, // or empty object based on your API requirements
      // };
    }

    console.log(final_data);
    return final_data;

 };

  // Submit handler
  const onSubmit = async (data: FormData) => {
    const success = await handleSubmit(data, {
      resetAfterSubmit: true,
      successMessage: "Followup successfully created!",
    });
    if (success) {
      onModalComplete?.(data);
      onClose();
    }
  };

  const handleComplete = useCallback(() => {
    const values = form.getValues();
    console.log("Followup Form Values:", values);
    onSubmit(values);
  }, [form, onSubmit]);

  const onPortalClose = () => {
    onClose();
  };
 const followupScheduleRequired = form.watch("followup.follow_up_schedule_required");
  return (
    <PortalModal
      title="Patient Followup"
      isOpen={open}
      onClose={onPortalClose}
      maxWidth="max-w-4xl"
    >
      <FormProvider {...form}>
        {parentDataProps && <PatientBasicCard patient={parentDataProps} />}

       
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                 {/* Discharge Form */}
                 <div className="space-y-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
                   <h3 className="text-lg font-semibold text-gray-900">
                     Add Followup
                   </h3>
                   <PatientFollowupForm />
                 </div>
       
                 {/* Follow-up Form */}
                 <div className="space-y-4 bg-stone-200 p-4 rounded-lg border border-green-100 relative">
                   <h3 className="text-lg font-semibold text-gray-900">
                     Add Next Follow-up Schedule
                   </h3>
       
                   {/* Disable section if follow-up not required */}
                   <fieldset disabled={!followupScheduleRequired} className="space-y-4">
                     <FollowUpScheduleForm />
       
                     {/* Helper text when disabled */}
                     {!followupScheduleRequired && (
                       <div className="text-center text-gray-500 text-sm py-4">
                        Enable `Follow-up required` to fill this section
                       </div>
                     )}
                   </fieldset>
                 </div>
               </div>

         <DebugButton/>


        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-4 pt-4 border-t mb-3">
          <ActionButtons>
            <ActionButton
              variant="primary"
              disabled={!form.formState.isValid || isFormLoading}
              loading={isFormLoading}
              onClick={handleComplete}
            >
              Save
            </ActionButton>
            <ActionButton
              variant="reset"
              onClick={() => handleReset()}
            >
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
