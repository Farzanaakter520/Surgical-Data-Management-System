import * as z from "zod";
import { postOpSchema } from "@/app/a-reusable-form-page-components/postopForm";
import { admissionSchema } from "@/app/a-reusable-form-page-components/admissionForm";
import { preOpSchema } from "@/app/a-reusable-form-page-components/preopForm";
import { patientRegistrationSchema } from "@/app/a-reusable-form-page-components/registrationForm";
import { fileUploadSchema } from "@/app/a-reusable-form-page-components/fileUploadForm";

export const schema = patientRegistrationSchema
  .extend(admissionSchema.shape)
  .extend(postOpSchema.shape)
  .extend(fileUploadSchema.shape)
  .extend(preOpSchema.shape);

export type Schema = z.infer<typeof schema>;
