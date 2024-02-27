import { useFormContext } from "react-hook-form";

export interface SelectOptionProps {
<<<<<<< HEAD
  key: any;
  label?: any;
=======
  label: any;
>>>>>>> f9fd4392f6e796d166d24ca8a30803b0c381885b
  value: any;
}

export type SelectProps = {
  id: string;
  name: string;
  options: SelectOptionProps[] | undefined;
  value?: any;
  defaultValue?:string;
  width?: string;
  height?: string;
  readOnly?: boolean;
  isAdd?: boolean;
  rules?: Record<string, any>;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isPlaceholder?: boolean;
};

export const Select: React.FC<SelectProps> = ({
  id,
  name,
  options,
  value,
  defaultValue,
  rules = {},
  width = "w-full",
  height = "h-8",
  readOnly = false,
  isAdd = false,
  placeholder = "선택(select)",
  onChange,
  isPlaceholder = true,
}) => {
  const { register } = useFormContext();
  let readOnlyCss;
  if (readOnly) {
    readOnlyCss = "read-only:bg-gray-100";
  }
  return (
    <select
      {...register(name, rules)}
      id={id}
      name={name}
      disabled={readOnly}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`block ${width} ${height} p-0 pl-2 text-[13px] form-select ${readOnlyCss} ${
        isAdd ? "border-orange-400" : "border-gray-300"
      } bg-white focus:ring-blue-500 focus:border-blue-500 focus:ring-0 rounded`}>
      style="padding:0px"
      {/* {isPlaceholder ? <option value="">{placeholder}</option> : <></>} */}
      {options?.map((option) => (
        <option label={option.label} value={option.label}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
