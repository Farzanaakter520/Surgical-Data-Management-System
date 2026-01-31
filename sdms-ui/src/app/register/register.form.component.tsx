// app/user-form/page.tsx

"use client";

import { useRef, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//import { useToast } from "@/hooks/use-toast";


//import { SchemaConfig } from "./schemaConfig";
import { useRouter } from "next/navigation";
//import { submitForm } from "@/lib/actions/formServerActions";
//import { useLoading } from "@/contexts/loading-context";

export default function RegisterFormPage() {
 
  //const { showToast } = useToast();
 // const { startLoading, stopLoading } = useLoading();
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  //const formSchema = generateZodSchema(SchemaConfig, t);

  // const form = useForm({
  //   resolver: zodResolver(formSchema),
  //   mode: "onChange",
  // });

  // Focus first input on render
  useEffect(() => {
    const timeout = setTimeout(() => {
      const firstInput = formRef.current?.querySelector(
        "input"
      ) as HTMLInputElement | null;
      firstInput?.focus();
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = (data: any) => {
  //   startTransition(async () => {
  //  //   const isValid = await form.trigger();
  //     if (!isValid) return;

  //     try {
  //       startLoading();
  //       console.log("data", data);
  //       const result = await submitForm(
  //         "iam",
  //         SchemaConfig.urls?.SAVE as string,
  //         data
  //       );
  //       console.log("result", result);
  //       if (!result.success) {
  //         showToast("error", result.msg || "❌ Save failed");
  //         return;
  //       }

  //       if (result) {
  //         showToast("success", "🎉 User saved successfully!");
  //         localStorage.setItem("token", result.data.token);
  //         handleReset();
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       showToast("error", "❌ Something went wrong. Please try again.");
  //     } finally {
  //       stopLoading();
  //     }
  //   });
  };

  const handleReset = () => {
  //   form.reset();
  //   const firstInput = formRef.current?.querySelector(
  //     "input"
  //   ) as HTMLInputElement | null;
  //   firstInput?.focus();
  // };

  // const handleBackClick = () => {
  //   router.push("/login");
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
     <div>register</div>
      {/* <DynamicForm
        schema={SchemaConfig}
        onSubmit={handleSubmit}
        onReset={handleReset}
        form={form}
        formRef={formRef}
        onBackClick={handleBackClick}
        loading={isPending} // disable buttons/spinner while submitting
      /> */}
    </section>
  );
}
