"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useCallback, useEffect, useState, useTransition } from "react";
import type { ZodType, infer as zInfer } from "zod";

import { submitForm } from "@/lib/actions/formServerActions";
import { useToast } from "@/hooks/use-toast";
import { useValidationErrorHandler } from "@/hooks/use-validation-error-handler";
import { useLoading } from "@/contexts/loading-context";

type SubmitOptions = {
  resetAfterSubmit?: boolean;
  resetFocusField?: string;
  successMessage?: string;
};

type UseSmartFormProps<TSchema extends ZodType<any, any>> = {
  schema: TSchema|any;
  formConfig: any;
  defaultValues?: Partial<zInfer<TSchema>>|any;
  initialData?: Partial<zInfer<TSchema>>|any;
  onSubmit?: (data: zInfer<TSchema>) => Promise<void>|any;
  onReset?: () => void;
  onClose?: () => void;
  onBeforeSubmit?: (data: zInfer<TSchema>) => Promise<zInfer<TSchema>> | zInfer<TSchema>|any;
};

export function useSmartForm<TSchema extends ZodType<any, any>>({
  schema,
  formConfig,
  defaultValues = {} as Partial<zInfer<TSchema>>,
  initialData = {} as Partial<zInfer<TSchema>>,
  onSubmit: customOnSubmit,
  onReset: customOnReset,
  onClose: customOnClose,
  onBeforeSubmit,
}: UseSmartFormProps<TSchema>) {
  const { showToast } = useToast();
  const { handleValidationErrors } = useValidationErrorHandler();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  
  // ✅ now schema is passed in
  const form = useForm<zInfer<TSchema>>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Hydrate with initialData
  useEffect(() => {
    if (
      initialData &&
      Object.keys(initialData).length > 0 &&
      JSON.stringify(initialData) !== JSON.stringify(defaultValues)
    ) {
      form.reset(initialData);
    }
  }, [initialData, defaultValues, form]);

  // Focus helper
  const doFocus = useCallback((fieldname: string) => {
    setTimeout(() => {
      if (formRef.current) {
        const input = formRef.current.querySelector(`[name="${fieldname}"]`);
        if (input) (input as HTMLElement).focus();
      }
    }, 100);
  }, []);

  const handleReset = useCallback((fieldName?: string) => {
    console.log('handle reset');
    
    // Force immediate reset with default values
    form.reset(defaultValues as any, {
      keepDefaultValues: false,
      keepDirty: false,
      keepErrors: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false,
    });
    
    // Force a re-render by triggering form state change
   // form.trigger();
    
    if (fieldName) {
      setTimeout(() => doFocus(fieldName), 150);
    }
  }, [form, defaultValues, doFocus]);

  // Populate
  const populateFormData = useCallback(
    (data: any, focusField?: string) => {
        form.reset({ ...data });
      if (focusField) doFocus(focusField);
    },
    [form, doFocus]
  );

  // Submit
  const handleSubmit = useCallback(
    async (data: zInfer<TSchema>, options?: SubmitOptions) => {
      setLoading(true);
      startLoading();
      console.log('Inside handle submit of use smart form ',data)
      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            let finalData = data;

            if (onBeforeSubmit) {
              finalData = await onBeforeSubmit(data);
            }

            if (customOnSubmit) {
              await customOnSubmit(finalData);
              setLoading(false);
              stopLoading();
              resolve(true);
              return;
            }
            console.log("form config", formConfig);
            console.log("final data", finalData);
            const result = await submitForm(formConfig.service, formConfig.urls?.SAVE, finalData);

            if (!result.success) {
              showToast("error", result.error || result.msg || "Validation failed");
              setLoading(false);
              stopLoading();
              resolve(false);
              return;
            }

            if (options?.successMessage) {
              showToast("success", options.successMessage);
            }

            if (options?.resetAfterSubmit) {
              handleReset(options.resetFocusField);
            }

            setLoading(false);
            stopLoading();
            resolve(true);
          } catch (error) {
            console.error(error);
            showToast("error", "Something went wrong.");
            setLoading(false);
            stopLoading();
            resolve(false);
          }
        });
      });
    },
    [onBeforeSubmit, customOnSubmit, formConfig.urls?.SAVE, showToast]
  );

  // Close
  const handleClose = useCallback(() => {
    if (customOnClose) return customOnClose();

    const closePath = formConfig.urls?.close;
    if (closePath) router.push(closePath);
  }, [customOnClose, formConfig.urls, router]);

  return {
    form,
    formRef,
    doFocus,
    handleSubmit,
    handleReset,
    handleClose,
    populateFormData,
    isPending,
    isFormLoading: loading,
  };
}
