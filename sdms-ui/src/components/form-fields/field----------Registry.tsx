"use client";

import InputField from "./TextField";
import NumberField from "./NumberField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";
import DateTimeField from "./DateTimeField";
import DateField from "./DateField";
import DynamicSelectField from "./DynamicSelectField";
import RadioField from "./RadioField";
import MultiSelectField from "./MultiSelectField";
import MultiSelectCheckboxField from "./MultiSelectCheckboxField";
import  ListInputField  from "./ListInputField";
import TimeField from "./timeField";
import CheckboxField from "./CheckboxField";
import HiddenField from "./HiddenField";



export const fieldRegistry: Record<string, React.ElementType> = {
  text: InputField,
  textarea: TextAreaField,
  numbericText:NumberField,
  radio:RadioField,
  hidden:HiddenField,
  
  select: SelectField,
  dynamicSelect:DynamicSelectField,
  multiSelect:MultiSelectField,
  multiSelectCheckbox:MultiSelectCheckboxField,


  datetime: DateTimeField,
  date:DateField,
  time:TimeField,

  checkbox:CheckboxField,


  listInput:ListInputField
  
  // You can keep adding: checkbox, radio, fileupload, etc.
};
