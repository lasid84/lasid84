import { useFormContext } from "react-hook-form";
const { log } = require('@repo/kwe-lib/components/logHelper');

export interface SelectOptionProps {
  key: any;
  value: any;
}

export type SelectProps = {
  id: string;
  name: string;
  options: SelectOptionProps[];
  value?: any;
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
  rules = {},
  width = "w-full",
  height = "h-8",
  readOnly = false,
  isAdd = false,
  placeholder = "선택(select)",
  onChange,
  isPlaceholder = true,
}) => {
  const { register, setValue, getValues } = useFormContext();
  let readOnlyCss;
  let currentValue = value ? value : getValues()[name];
  if (!currentValue) {
    options.map((option, i) => {
      if (i == 0) {
        currentValue = option.key;
        setValue(name, currentValue);
      }
    });
  };

  rules = {
    ...rules,
    onChange: () => {
      setValue(name, currentValue);
    },
  };

  // log("====",currentValue, JSON.stringify(options[0]));
  
  if (readOnly) {
    readOnlyCss = "read-only:bg-gray-100";
  }
  return (
    <select
      {...register(name, rules)}
      id={id}
      name={name}
      disabled={readOnly}
      // value={currentValue}
      defaultValue={currentValue}
      onChange={onChange}
      className={`block ${width} ${height} p-0 pl-2 text-[13px] form-select ${readOnlyCss} ${
        isAdd ? "border-orange-400" : "border-gray-300"
      } bg-white mx-1 my-1 focus:ring-blue-500 focus:border-blue-500 focus:ring-0 rounded`}>
      {/* {isPlaceholder ? <option value="">{placeholder}</option> : <></>} */}
      {options?.map((option, i) => (
        <option key={option.key} value={option.key}>
          {option.value}
        </option>
      ))}
    </select>
  );
};
