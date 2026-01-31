// "use client";

// import {
//   ButtonType,
//   FieldType,
//   FieldVariant,
//   Form,
//   FormType,
//   LayoutWidth,
//   SectionType,
//   TitlePosition
// } from "@/components/dynamic-form-builder/types";

// import {fetchOptionsForEntity} from "@/lib/data/optiondata"

// export const SchemaConfig: Form = {
//   form_id: "patientForm",
//   form_type: FormType.REGULAR,
//   form_title_icon:"UserPlus",
//   form_title: { en: "User Registration", bn: "User Registration" },
//   title_position: TitlePosition.CENTER,
//   form_description: {
//     en: "Please fill in user details below.",
//     bn: "অনুগ্রহ করে নিচে user বিবরণ পূরণ করুন।"
//   },
//   Buttons: [ButtonType.SAVE, ButtonType.RESET, ButtonType.CLOSE],
//   urls: {
//     SAVE: "/auth/signup",
//     RESET: "/auth/reset",
//     CLOSE: "/auth/signin",
//   },
//   layout_width: LayoutWidth.FULL,

//   sections: [
//     {
//       section_id: "patientPersonalInfo",
//       section_type: SectionType.Regular,
//       section_title: {
//         en: "",
//         bn: ""
//       },
//       section_description: {
//         en: "",
//         bn: ""
//       },
//       position: 1,
//       layout_width: LayoutWidth.FULL,
//       fields: [
//           {
//           field_id: "first_name",
//           field_label: { en: "First Name", bn: "প্রথম নাম" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 2,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "Enter first name",
//             bn: "প্রথম নাম লিখুন"
//           },
//           validations: {
//             maxLength: 100
//           },
//           layout_width: LayoutWidth.HALF
//         },
//         {
//           field_id: "last_name",
//           field_label: { en: "Last Name", bn: "শেষ নাম" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 3,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "Enter last name",
//             bn: "শেষ নাম লিখুন"
//           },
//           validations: {
//             maxLength: 100
//           },
//           layout_width: LayoutWidth.HALF
//         },
        
//         {
//           field_id: "email",
//           field_label: { en: "Email", bn: "ইমেইল" },
//           type: FieldType.Email,
//           variant: FieldVariant.Standard,
//           position: 4,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "you@example.com",
//             bn: "আপনারইমেইল@উদাহরণ.কম"
//           },
//           validations: {
//             pattern: "^\\S+@\\S+\\.\\S+$",
//             maxLength: 255,
//             customMessage: {
//               en: "Please enter a valid email address",
//               bn: "একটি বৈধ ইমেইল ঠিকানা লিখুন"
//             }
//           },
//           layout_width: LayoutWidth.HALF
//         },
//         {
//           field_id: "password",
//           field_label: { en: "password", bn: "Password" },
//           type: FieldType.Password,
//           variant: FieldVariant.Standard,
//           position: 5,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "",
//             bn: ""
//           },
//           validations: {
//             maxLength: 20
//           },
//           layout_width: LayoutWidth.HALF
//         },
//         {
//           field_id: "password_confirmation",
//           field_label: { en: "Confirm Password", bn: "Confirm Password" },
//           type: FieldType.Password,
//           variant: FieldVariant.Standard,
//           position: 5,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "",
//             bn: ""
//           },
//           validations: {
//             maxLength: 20
//           },
//           layout_width: LayoutWidth.HALF
//         }
        
//       ]
//     }
//   ]
// };
