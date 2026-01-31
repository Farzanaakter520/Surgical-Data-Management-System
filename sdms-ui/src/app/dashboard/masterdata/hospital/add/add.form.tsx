"use client";

import React, { useCallback, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PortalModal from "@/components/utility-components/portal-modal";
import { ActionButton, ActionButtons } from "@/components/utility-components/ActionButtons";
import { useSmartForm } from "@/hooks/useSmartForm";
import { useFormDebug } from "@/hooks/use-form-debug";
import { HospitalForm, hospitalSchema, hospitalDefaults } from "./form.fields-schema";

interface HospitalInfoProps {
  open: boolean;
  onClose: () => void;
  onModalComplete?: (data: any) => void;
  parentDataProps?: any;
  actionMode?: string;
}

/* ------------------------------------
 * SCHEMA ALIAS & TYPE
 * ------------------------------------ */
type FormData = z.infer<typeof hospitalSchema>;

/* ------------------------------------
 * MAIN COMPONENT
 * ------------------------------------ */
export const AddHospital = ({
  open,
  onClose,
  onModalComplete,
  parentDataProps,
  actionMode,
}: HospitalInfoProps) => {
  /* Setup smart form hook */
  const { form, formRef, handleSubmit, isFormLoading, handleReset, populateFormData } =
    useSmartForm<typeof hospitalSchema>({
      schema: hospitalSchema,
      formConfig: {
        service: "sdms",
        urls: { SAVE: "/hospitals/create" },
      },
      onBeforeSubmit: async (data) => prepData(data),
      defaultValues: hospitalDefaults,
    });

    /* handling edit mode  and new mode */
    /* if edit mode, populate the form with the data from the parentDataProps */
    /* if new mode, reset the form with the default values */
  useEffect(() => {

    if (parentDataProps) {
       if(actionMode=="edit"){
         populateFormData(parentDataProps);
      }
      else{
        handleReset("name");
      }
    }
  }, [parentDataProps, populateFormData, actionMode]);

  
  // Debug helper (optional)
  // useFormDebug(form);

  /* ------------------------------------
   * Data preprocessing before submit
   * ------------------------------------ */
  const prepData = (data: FormData) => {
    console.log("Preparing hospital data:", data);

    const final_data = {
      ...data,
      action_mode: "insert",
      created_by: parentDataProps?.user_id ?? "system",
    };

    console.log("Final payload:", final_data);
    return final_data;
  };

  /* ------------------------------------
   * Handle submit
   * ------------------------------------ */
  const onSubmit = async (data: FormData) => {
    const success = await handleSubmit(data, {
      resetAfterSubmit: true,
      successMessage: "Hospital / Clinic successfully created!",
    });
    if (success) {
      onModalComplete?.(data);
      onClose();
    }
  };

  /* ------------------------------------
   * Handle complete (manual save click)
   * ------------------------------------ */
  const handleComplete = useCallback(() => {
    const values = form.getValues();
    console.log("Hospital Form Values:", values);
    onSubmit(values);
  }, [form, onSubmit]);

  const onPortalClose = () => onClose();

  /* ------------------------------------
   * Render UI
   * ------------------------------------ */
  return (
    <PortalModal
      title="Hospital / Clinic Information"
      isOpen={open}
      onClose={onPortalClose}
      maxWidth="max-w-3xl"
    >
      <FormProvider {...form}>
        {/* MAIN FORM CONTENT */}
        {/* <div className="space-y-6 bg-sky-50/30 p-4 rounded-lg border border-sky-100"> */}
          <HospitalForm />
        {/* </div> */}

        {/* ACTION BUTTONS */}
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

            <ActionButton
              variant="cancel"
              onClick={onPortalClose}
            >
              Cancel
            </ActionButton>
          </ActionButtons>
        </div>
      </FormProvider>
    </PortalModal>
  );
};
