import { useEffect } from "react";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { LabelTop } from "components/react-hook-form/label";
import { Select } from "components/react-hook-form/select-row";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  id: string;
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  width?: string;
  children?: any;
  allYn?: boolean;
  isPlaceholder?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  outerClassName?: string;
  readOnly?: boolean;
};

export const TSelect2: React.FC<SelectProps> = ({
  id,
  label,
  value,
  defaultValue,
  options,
  placeholder,
  width = "w-full",
  children,
  allYn = false,
  isPlaceholder = true,
  onChange,
  outerClassName,
  readOnly = false,
}) => {
  if (allYn) {
    options = [{ value: "", label: "전체(All)" }, ...options];
  }
  return (
    <div className="flex flex-row items-start">
      <label
        htmlFor={id}
        className={`w-full md:text-right mx-1 py-2`}>
        {label}
      </label>
      <Select
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        width={width}
        options={options}
        isPlaceholder={isPlaceholder}
        onChange={onChange}
        readOnly={readOnly}
      />
      {children}
    </div>
  );
};
