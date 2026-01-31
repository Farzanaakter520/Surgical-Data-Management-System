"use client";

import React, { useCallback, useEffect } from "react";
import { useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import PortalModal from "@/components/utility-components/portal-modal";
import {
  DischargeForm,
  dischargeSchema,
  DischargeFormData,
} from "@/app/a-reusable-form-page-components/dischargeForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FollowUpScheduleForm,
  followUpScheduleSchema,
} from "@/app/a-reusable-form-page-components/followupScheduleForm";
import { submitForm, ActionResponse } from "@/lib/actions/formServerActions"; // Update the import path
import {
  ActionButton,
  ActionButtons,
} from "@/components/utility-components/ActionButtons";
import { useSmartForm } from "@/hooks/useSmartForm";
import { PatientBasicCard } from "@/app/a-project-components/patient-basic-card";
import { useFormDebug } from "@/hooks/use-form-debug";

interface ReleaseFollowupScheduleProps {
  open: boolean;
  parentDataProps?: any;
  onClose: () => void;
  onModalComplete?: (data: any) => void;
}

// Create a combined schema type
type CombinedFormData = z.infer<typeof dischargeSchema> &
  z.infer<typeof followUpScheduleSchema>;

export const ReleaseFollowupSchedule = ({
  open,
  parentDataProps,
  onClose,
  onModalComplete,
}: ReleaseFollowupScheduleProps) => {
  // Create proper combined schema
  const schema = z
    .object({
      discharge: dischargeSchema.shape.discharge,
      followup_schedule: z.object({}).catchall(z.any()).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.discharge.follow_up_required) {
        const followUpScheduleResult = followUpScheduleSchema.safeParse(data);
        if (!followUpScheduleResult.success) {
          followUpScheduleResult.error.issues.forEach((issue) => {
            // ✅ Correct property
            ctx.addIssue({
              ...issue,
              path: issue.path,
            });
          });
        }
      }
    });

  const { form, formRef, handleSubmit, isFormLoading, handleReset } =
    useSmartForm({
      schema: schema,
      formConfig: {
        service: "sdms",
        urls: { SAVE: "/discharge-followup/handle" },
      },
      onBeforeSubmit: async (data) => prepData(data),
      // defaultValues: {
      //   discharge: {
      //     follow_up_required: false, // Default to false
      //     // other default values...
      //   },
      //   follow_up: followUpDefaults.follow_up
      // },
    });

  const { DebugButton } = useFormDebug(form);

  const followRequired = form.watch("discharge.follow_up_required");

  // Enhanced prepData function
  const prepData = (data: any) => {
    console.log("Preparing data:", data);
    console.log("parent data props :", parentDataProps);

    const finalData = {
      patient_id: parentDataProps.patient_id,
      admission_id: parentDataProps.admission_id,
      hospital_id: parentDataProps.hospital_id,
      discharge: { ...data.discharge, action_mode: "insert" },
      followup_schedule: { ...data.followup_schedule, action_mode: "insert" },
    };
    
    // If follow-up is not required, clear follow-up data
    if (!data.discharge.follow_up_required) {
      return { ...finalData, followup: null };
    }

    console.log(finalData);
    return finalData;
  };

  const onSubmit = async (data: any) => {
    //  console.log("from on submit ", data);
    const success = await handleSubmit(data, {
      resetAfterSubmit: true,
      successMessage: "Release and schedule Successfully created!",
      resetFocusField: "discharge_date_time",
    });
    // console.log(success)
    if (success) {
      onModalComplete?.(data);
      onClose();
    }
  };

  const onPortalClose = () => {
    onClose();
  };

  const handleComplete = useCallback(() => {
    const values = form.getValues();
    console.log("Form values:", values);
    console.log("Discharge data:", values.discharge);
    console.log("Follow-up data:", values.followup_schedule);
    onSubmit(values);
  }, [form, onSubmit]);

  // Determine if action button should be enabled
  const isSubmitEnabled = (() => {
    // Basic form validation
    const isDischargeValid = form.formState.isValid;

    // If follow-up is required, check if follow-up form has errors
    if (followRequired) {
      const followUpValues = form.getValues("followup_schedule");
      const hasFollowUpErrors =
        Object.keys(form.formState.errors.followup_schedule || {}).length > 0;
      const isFollowUpFilled =
        followUpValues &&
        followUpValues.doctor_id &&
        followUpValues.scheduled_date &&
        followUpValues.follow_up_type_id;

      return isDischargeValid && !hasFollowUpErrors && isFollowUpFilled;
    }

    // If follow-up not required, only check discharge form
    return isDischargeValid;
  })();

  return (
    <PortalModal
      title="Discharge and Followup Schedule"
      isOpen={open}
      onClose={onPortalClose}
      maxWidth="max-w-6xl"
    >
      <FormProvider {...form}>
        {parentDataProps && <PatientBasicCard patient={parentDataProps} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Discharge Form */}
          <div className="space-y-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900">
              Discharge Information
            </h3>
            <DischargeForm />
          </div>

          {/* Follow-up Form */}
          <div className="space-y-4 bg-stone-200 p-4 rounded-lg border border-green-100 relative">
            <h3 className="text-lg font-semibold text-gray-900">
              Follow-up Schedule
            </h3>

            {/* Disable section if follow-up not required */}
            <fieldset disabled={!followRequired} className="space-y-4">
              <FollowUpScheduleForm />

              {/* Helper text when disabled */}
              {!followRequired && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Enable &quot;Follow-up required&quot; to fill this section
                </div>
              )}
            </fieldset>
          </div>
        </div>

        {/* <DebugButton/> */}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-1 pt-1 border-t mb-3">
          <ActionButtons>
            <ActionButton
              variant="primary"
              disabled={!isSubmitEnabled || isFormLoading}
              loading={isFormLoading}
              onClick={handleComplete}
            >
              Save
            </ActionButton>
            <ActionButton
              variant="reset"
              onClick={() => {
                handleReset("hello");
              }}
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