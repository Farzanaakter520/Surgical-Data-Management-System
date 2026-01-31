"use client";

import { useRef, useState, useTransition } from "react";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { schema } from "@/app/dashboard/manage-patient/form-components/add-surgical-patient/schema";
import { PatientRegistrationForm } from "@/app/a-reusable-form-page-components/registrationForm";
import { AdmissionForm } from "@/app/a-reusable-form-page-components/admissionForm";
import { PreopForm } from "@/app/a-reusable-form-page-components/preopForm";
// import FileUploadForm, { FileUploadFormRef } from "@/app/a-reusable-form-page-components/fileUploadForm";
import FileUploadForm, { FileUploadFormRef } from "@/app/a-reusable-form-page-components/fileUploadForm";
import { PostopForm } from "@/app/a-reusable-form-page-components/postopForm";
import { submitForm, ActionResponse } from "@/lib/actions/formServerActions";
import { useFormDebug } from "@/hooks/use-form-debug";
import { useToast } from "@/hooks/use-toast";

const steps = [
  {id: "registration", label: "Registration", component: PatientRegistrationForm},
  { id: "admission", label: "Admission", component: AdmissionForm },
  { id: "preop", label: "Pre-Op", component: PreopForm },
  { id: "fileupload", label: "File Upload", component: FileUploadForm },
  { id: "postop", label: "Post-Op", component: PostopForm },
];

export type FormData = z.infer<typeof schema>;

export default function Stepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileUploadRef = useRef<FileUploadFormRef>(null);
  const [submitResult, setSubmitResult] = useState<ActionResponse | null>(null);
  const { showToast } = useToast();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema) as unknown as Resolver<FormData>,
    mode: "onChange",
    defaultValues: {
      registration: { name: "", age: undefined },
      admission: {
        patient_id: "1",
        hospital_id: "",
        date_of_adm: "",
        // referral_source_id: "",
        remarks: "",
      },
      preop: { notes: "" },
      // fileupload: { files: [] },
      postop: {},
    },
  });

  const { DebugButton } = useFormDebug(methods);
  const {
    formState: { errors },
    trigger,
    getValues,
  } = methods;

  const handleNext = async () => {
    const stepId = steps[currentStep].id;
    const isValidStep = await trigger(stepId as any);

    if (isValidStep && currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setShowValidation(false);
    } else if (currentStep === steps.length - 1) {
      const isValid = await trigger();
      if (isValid) {
        const formData = getValues();
        console.log("✅ Final Submit Data:", formData);
        
        // Step 1️⃣ Upload Files
        const uploadResult = await fileUploadRef.current?.uploadFiles();
        if (!uploadResult?.success) {
          showToast("error", "File upload failed. Please try again.");
          return;
        }

        // Step 2️⃣ Prepare array of fileupload entries
        // const uploadedFiles = uploadResponse.data.map((file) => ({
        //   file_name: file.name,
        //   file_type: file.name.split(".").pop() || "unknown",
        //   document_type: "post_op", // or "pre_op" / "lab_report" based on context
        //   drive_file_id: file.fileId,
        //   remarks: "Uploaded from patient registration step",
        // }));

        // Step 3️⃣ Attach uploaded file info
        let finalPayload = { ...formData };
       
        if (uploadResult?.data) { 
          finalPayload = { ...finalPayload, fileupload: uploadResult?.data };
        }

        console.log(finalPayload);

       // return;

        // Use React's startTransition to submit the form without blocking UI
        startTransition(async () => {
          const result = await submitForm(
            "sdms",
            "/patient_registration_to_post_op/create",
            finalPayload
          );
          setSubmitResult(result);
          console.log(result);

          if (result.success) {
            showToast("success", "Form submitted successfully!");
            methods.reset();
          } else {
            showToast("error", "Form submission failed", {
              description: result.msg,
            });
          }
        });
      } else {
        setShowValidation(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setShowValidation(false);
    }
  };

  const handleStepClick = async (index: number) => {
    if (index < currentStep) {
      setCurrentStep(index);
      setShowValidation(false);
    } else if (index > currentStep) {
      const isValidStep = await trigger(steps[currentStep].id as any);
      if (isValidStep) {
        setCurrentStep(index);
        setShowValidation(false);
      }
    }
  };

  const handleEditStep = (index: number) => {
    setCurrentStep(index);
    setShowValidation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-3 px-2">
      <FormProvider {...methods}>
        <div className="mb-2 h-1 w-full bg-gray-200 rounded-full">
          <div
            className="h-1 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center relative">
              <button
                onClick={() => handleStepClick(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${
                    i === currentStep
                      ? "bg-blue-500 border-blue-500 text-white scale-110"
                      : i < currentStep
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                  ${errors[s.id as keyof typeof errors] ? "border-red-500 bg-red-50" : ""}`}
              >
                {i < currentStep ? (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </button>
              <span
                className={`text-xs mt-2 font-medium hidden sm:block max-w-16 text-center
                ${
                  i === currentStep
                    ? "text-blue-600"
                    : i < currentStep
                    ? "text-green-600"
                    : "text-gray-500"
                }
                ${errors[s.id as keyof typeof errors] ? "text-red-600" : ""}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Form content - FIXED: Always show current step */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
          {steps.map((step, index) => {
            const StepComponent = step.component;
            return (
              <div
                key={step.id}
                className={index === currentStep ? "block" : "hidden"}
              >
                {/* Pass ref only to FileUploadForm */}
                {step.id === "fileupload" ? (
                  <StepComponent ref={fileUploadRef} />
                ) : (
                  <StepComponent />
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-md flex items-center ${
              currentStep === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Previous
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={handleNext}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}
            disabled={isPending}
          >
            {isPending
              ? "Submitting..."
              : currentStep === steps.length - 1
              ? "Complete"
              : "Next"}
          </button>
        </div>

        {/* <DebugButton /> */}
      </FormProvider>
    </div>
  );
}