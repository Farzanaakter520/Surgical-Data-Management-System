// import {
//   ButtonType,
//   FieldType,
//   FieldVariant,
//   Form,
//   FormType,
//   SectionType,
// } from "@/components/dynamic-form-builder/types";
// import { LayoutWidth } from "@/components/dynamic-form-builder/types";
// import type { TableConfig } from "@/components/dynamic-table-builder/advanced-table-component/table-types";
// import {
//   fetchOptionsForEntity,
//   getOptionLabelText,
// } from "@/lib/data/optiondata";

// import { Eye, Edit, Trash2 } from "lucide-react";

// export const formConfig: Form = {
//   form_id: "doctorInfoForm",
//   form_type: FormType.REGULAR,
//   form_title: {
//     en: "Doctor Information",
//     bn: "ডাক্তারের তথ্য",
//   },
//   form_description: {
//     en: "",
//     bn: "",
//   },
//   Buttons: [ButtonType.SAVE, ButtonType.RESET, ButtonType.CLOSE],
//   urls: {
//     SAVE: "/doctors/create",
//     RESET: "/",
//     CLOSE: "/dashboard/masterdata",
//   },
//   layout_width: LayoutWidth.FULL,
//   sections: [
//     {
//       section_id: "doctorBasicInfo",
//       section_type: SectionType.Regular,
//       section_title: {
//         en: "",
//         bn: "",
//       },
//       section_description: {
//         en: "",
//         bn: "",
//       },
//       position: 1,
//       layout_width: LayoutWidth.FULL,
//       fields: [
//         {
//           field_id: "name",
//           field_label: { en: "First Name", bn: "প্রথম নাম" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 1,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "Enter first name",
//             bn: "প্রথম নাম লিখুন",
//           },
//           validations: {
//             minLength: 1,
//             maxLength: 50,
//           },
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "surname",
//           field_label: { en: "Surname", bn: "শেষ নাম" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 2,
//           is_required: true,
//           is_enabled: true,
//           placeholder: {
//             en: "Enter surname",
//             bn: "শেষ নাম লিখুন",
//           },
//           validations: {
//             minLength: 1,
//             maxLength: 50,
//           },
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "gender",
//           field_label: { en: "Gender", bn: "লিঙ্গ" },
//           type: FieldType.Select,
//           variant: FieldVariant.Standard,
//           position: 3,
//           is_required: true,
//           is_enabled: true,
//           options: [
//             { value: "M", label: { en: "Male", bn: "পুরুষ" } },
//             { value: "F", label: { en: "Female", bn: "মহিলা" } },
//             { value: "O", label: { en: "Other", bn: "অন্যান্য" } },
//           ],
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "date_of_birth",
//           field_label: { en: "Date of Birth", bn: "জন্ম তারিখ" },
//           type: FieldType.Date,
//           variant: FieldVariant.Standard,
//           position: 4,
//           is_required: true,
//           is_enabled: true,
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "email",
//           field_label: { en: "Email", bn: "ইমেইল" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 5,
//           is_required: true,
//           is_enabled: true,
//           placeholder: { en: "Enter email", bn: "ইমেইল লিখুন" },
//           validations: {
//             pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
//             customMessage: {
//               en: "Enter a valid email address",
//               bn: "একটি বৈধ ইমেইল লিখুন",
//             },
//           },
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "contact_number",
//           field_label: { en: "Contact Number", bn: "যোগাযোগ নম্বর" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 6,
//           is_required: true,
//           is_enabled: true,
//           validations: {
//             pattern: "^[+]?[0-9]{7,15}$",
//             customMessage: {
//               en: "Enter a valid contact number",
//               bn: "একটি বৈধ যোগাযোগ নম্বর লিখুন",
//             },
//           },
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "alternative_contact_number",
//           field_label: { en: "Alternative Contact", bn: "বিকল্প যোগাযোগ নম্বর" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 7,
//           is_required: false,
//           is_enabled: true,
//           validations: {
//             pattern: "^[+]?[0-9]{7,15}$",
//           },
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "address_line_1",
//           field_label: { en: "Address Line 1", bn: "ঠিকানা" },
//           type: FieldType.TextArea,
//           variant: FieldVariant.Standard,
//           position: 8,
//           is_required: true,
//           is_enabled: true,
//           layout_width: LayoutWidth.FULL,
//         },
//         {
//           field_id: "address_line_2",
//           field_label: { en: "Address Line 2", bn: "ঠিকানা লাইন ২" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 9,
//           is_required: false,
//           is_enabled: true,
//           layout_width: LayoutWidth.FULL,
//         },
//         {
//           field_id: "web_page",
//           field_label: { en: "Web Page", bn: "ওয়েব পেজ" },
//           type: FieldType.Text,
//           variant: FieldVariant.Standard,
//           position: 10,
//           is_required: false,
//           is_enabled: true,
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "designation_id",
//           field_label: { en: "Designation", bn: "পদবি" },
//           type: FieldType.Select,
//           variant: FieldVariant.Standard,
//           position: 11,
//           is_required: true,
//           is_enabled: true,
//           options: () => fetchOptionsForEntity("designation"),
//           layout_width: LayoutWidth.HALF,
//         },
//         {
//           field_id: "specialty_id",
//           field_label: { en: "Specialty", bn: "বিশেষজ্ঞতা" },
//           type: FieldType.Select,
//           variant: FieldVariant.Standard,
//           position: 12,
//           is_required: true,
//           is_enabled: true,
//           options: () => fetchOptionsForEntity("specialty"),
//           layout_width: LayoutWidth.HALF,
//         },
//       ],
//     },
//   ],
// };

// export const tableConfig: TableConfig = {
//   title: "Doctor List",
//   description: "View and manage all doctor records",
//   exportFileName: "doctor-data",
//   allowBackButton: true,
//   allowAddNew: true,
//   searchable: true,
//   exportable: true,
//   columnfilterable: true,
//   enableRowselection: false,
//   enablePagination: true,
//   urls: {
//     dataURL: "/doctors/getlist",
//     deleteURL: "/doctors/delete/",
//     previewURL: "/doctors",
//   },
//   columns: [
//     {
//       accessorKey: "id",
//       label: "Doctor ID",
//       sortable: true,
//     },
//     {
//       accessorKey: "name",
//       label: "First Name",
//       sortable: true,
//       searchable: true,
//     },
//     {
//       accessorKey: "surname",
//       label: "Surname",
//       sortable: true,
//       searchable: true,
//     },
//     {
//       accessorKey: "gender",
//       label: "Gender",
//     },
//     {
//       accessorKey: "date_of_birth",
//       label: "DOB",
//     },
//     {
//       accessorKey: "contact_number",
//       label: "Contact",
//     },
//     {
//       accessorKey: "alternative_contact_number",
//       label: "Alt. Contact",
//     },
//     {
//       accessorKey: "email",
//       label: "Email",
//     },
//     {
//       accessorKey: "designation",
//       label: "Designation",
//     },
//     {
//       accessorKey: "specialty",
//       label: "Specialty",
//     },
//     {
//       accessorKey: "web_page",
//       label: "Web Page",
//     },
//     {
//       accessorKey: "address",
//       label: "Address",
//     },
//   ],
//   actions: ["Edit", "Delete", "View"],
//   pagination: {
//     pageSize: 10,
//     showSizeSelector: true,
//   },
// };
