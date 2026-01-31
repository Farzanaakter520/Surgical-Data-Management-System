"use client";
import { useCallback } from "react";
import MultiSelectField from "@/components/form-fields/MultiSelectField";
import MultiSelectCheckboxField from "@/components/form-fields/MultiSelectCheckboxField";
import TextAreaField from "@/components/form-fields/TextAreaField";
import { fetchOptionsForEntity } from "@/lib/data-manager/optiondata";
import FormFieldController from "@/components/form-fields/Forn-Field------Controller";
import { z } from "zod";
import { ExpandableSection } from "@/components/utility-components/expandable-section";
import { Microscope } from "lucide-react";

/* validations */
export const preOpSchema = z.object({
 preop: z.object({
    notes: z.string().optional(),
  }),
});

/* default values */

export type PreOpFormData = z.infer<typeof preOpSchema>;


/* UI design */
 

export  function PreopForm() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Pre-Op</h2>

      {/* Pre-Op Diagnosis */}
      <FormFieldController
        name="preop.diagnosis_id"
        type="multiSelect"
        label="Pre-Op Diagnosis"
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("diagnosis"),[])}}
       />

      {/* Co-Morbidities */}
      <FormFieldController
        name="preop.co_morbidities_id"
        label="Co-Morbidities"
        type="multiSelect"
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("comorbidities"),[])}}
      />

      {/* Drug History (Checkboxes) */}
      <FormFieldController
        name="preop.drug_history"
        label="Drug History"
        type="multiSelectCheckbox"
        componentProps={{options:useCallback(()=>fetchOptionsForEntity("drughistory"),[])}}
      />

      {/* Surgical History */}
      <FormFieldController
        name="preop.surgical_history"
        label="Surgical History"
        type="textarea"
        placeholder="Enter surgical history"
      />

      {/* Investigations History */}
      <ExpandableSection  title="Preop Investigations :"
          icon={<Microscope  className="h-5 w-5 text-blue-500" />}
          defaultExpanded={true}
          previewHeight={150}>
          <FormFieldController
            name="preop.investigations"
            label="Investigations"
            
            type="listInput"
            placeholder="Enter investigation value"
            required
            componentProps={{
              options: useCallback(() => fetchOptionsForEntity("investigations"), []),
            }}
          />
      </ExpandableSection>
    </div>
  );
}
