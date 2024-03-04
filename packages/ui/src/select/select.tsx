// import React from "react";

// export interface SelectOptionProps {
//   key?:any;
//   label?: any | undefined;
//   value: any;
// }

// export type SelectProps = {
//   id: string;
//   name: string;
//   options: SelectOptionProps[];
//   value?: any;
//   width?: string;
//   height?: string;
//   readOnly?: boolean;
//   isAdd?: boolean;
//   rules?: Record<string, any>;
//   placeholder?: string;
//   onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//   isPlaceholder?: boolean;
// };

// export const Select: React.FC<SelectProps> = ({
//   id,
//   name,
//   options,
//   value,
//   rules = {},
//   width = "w-full",
//   height = "h-8",
//   readOnly = false,
//   isAdd = false,
//   placeholder = "선택(select)",
//   onChange,
//   isPlaceholder = true,
// }) => {
//   //const { register } = useFormContext();
//   let readOnlyCss;
//   if (readOnly) {
//     readOnlyCss = "read-only:bg-gray-100";
//   }
//   return (
//     <select
//       //{...register(name, rules)}
//       id={id}
//       name={name}
//       //  defaultValue={value}
//       disabled={readOnly}
//       value={value}
//       onChange={onChange}
//       className={`block ${width} ${height} p-0 pl-2 text-[13px] form-select ${readOnlyCss} ${
//         isAdd ? "border-orange-400" : "border-gray-300"
//       } bg-white focus:ring-blue-500 focus:border-blue-500 focus:ring-0 rounded`}>
//       {isPlaceholder ? <option value="">{placeholder}</option> : <></>}
//       {options?.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );
// };
