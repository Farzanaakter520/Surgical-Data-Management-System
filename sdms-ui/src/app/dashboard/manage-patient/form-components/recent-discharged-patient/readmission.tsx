"use client";

import React, { useCallback, useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import PortalModal from "@/components/utility-components/portal-modal";
import { AdmissionForm, admissionSchema, admissionDefaults } from "@/app/a-reusable-form-page-components/admissionForm";
import { useSmartForm } from "@/hooks/useSmartForm";
import { PatientBasicCard } from "@/app/a-project-components/patient-basic-card";
import { ActionButton, ActionButtons } from "@/components/utility-components/ActionButtons";
import { useFormDebug } from "@/hooks/use-form-debug";


interface PatientReadmissionFormProps {
  open: boolean;
  parentDataProps?: any;
  onClose: () => void;
  onModalComplete?: (data: any) => void;
}

// Schema alias
type FormData = z.infer<typeof admissionSchema>;

export const PatientReadmission = ({
  open,
  parentDataProps,
  onClose,
  onModalComplete,
}: PatientReadmissionFormProps) => {
  // Setup form with smart form hook
  const { form, formRef, handleSubmit, isFormLoading, handleReset } =
    useSmartForm<any>({
      schema: admissionSchema,
      formConfig: {
        service: "sdms",
        urls: { SAVE: "/patAdm/create" },
      },
      onBeforeSubmit: async (data) => prepData(data),
      defaultValues: admissionDefaults,
    });
 
        /* for debugging */
    const { DebugButton } = useFormDebug(form);




    useEffect(() => {
      if (parentDataProps?.patient_id) {
        form.setValue("admission.patient_id", String(parentDataProps.patient_id));
      }
    }, [parentDataProps]);
  // Data preprocessing before submit
  const prepData = (data: FormData) => {
    const finalData = {
         ...data.admission,patient_id:parentDataProps?.patient_id, action_mode: "insert" ,
    };

    console.log("Final admission payload:", finalData);
    return finalData;
  };

  // Submit handler
  const onSubmit = async (data: FormData) => {
    const success = await handleSubmit(data, {
      resetAfterSubmit: true,
      successMessage: "Readmission successfully created!",
    });
    if (success) {
      onModalComplete?.(data);
      onClose();
    }
  };

  const handleComplete = useCallback(() => {
    const values = form.getValues();
    console.log("ReadmissionForm Values:", values);
    onSubmit(values);
  }, [form, onSubmit]);

  const onPortalClose = () => {
    onClose();
  };

  return (
    <PortalModal
      title="Patient ReAdmission"
      isOpen={open}
      onClose={onPortalClose}
      maxWidth="max-w-4xl"
    >
      <FormProvider {...form}>
        {parentDataProps && <PatientBasicCard patient={parentDataProps} />}

        <div className="space-y-4 bg-blue-50/30 p-4 rounded-lg border border-blue-100">
          {/* <h3 className="text-lg font-semibold text-gray-900">
            Admission
          </h3> */}

     
          <AdmissionForm />
        </div>

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
        {/* <DebugButton /> */}
      </FormProvider>
    </PortalModal>
  );
};
