import { useEffect } from "react";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { LabelTop } from "components/react-hook-form/label";
import { Select } from "components/react-hook-form/select-row";
const { log } = require('@repo/kwe-lib/components/logHelper');

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
  isPlaceholder?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  outerClassName?: string;
  readOnly?: boolean;
  allYn?: boolean;
};

export const TSelect2: React.FC<SelectProps> = ({
  id,
  label,
  options,
  value,  
  defaultValue,
  placeholder,
  width = "w-full",
  children,
  isPlaceholder = true,
  onChange,
  outerClassName,
  readOnly = false,
  allYn = true
}) => {

  let selectoptions:any[] = []
  
  if (options?.length > 0) {
    options.map((item:any, i) => {
      var key = item[Object.keys(item)[0]];
      var value = item[Object.keys(item)[1]];
      // log("==================", key, value)
      if (!allYn && value === 'ALL') return;
      if (!value) value = key;
      selectoptions.push({ key: key, value: value });
    })
  }
   log("select-row", options)
  return (
    // <div className="flex flex-row items-start">
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        // className={`w-full md:text-right mx-1 py-2`}>
        className={`block text-[13px] font-medium whitespace-nowrap`}>
        {label}
      </label>
      <Select
        id={id}
        name={id}
        value={value}
        placeholder={placeholder}
        width={width}
        options={selectoptions}
        isPlaceholder={isPlaceholder}
        // onChange={onChange}
        readOnly={readOnly}
        allYn={allYn}
      />
      {children}
    </div>
  );
};
