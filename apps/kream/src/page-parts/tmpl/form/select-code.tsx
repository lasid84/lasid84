'use client'
import { useEffect, useState } from "react";
import { InputWrapper } from "components/react-hook-form/input-wrapper";
import { LabelTop } from "components/react-hook-form/label";
import { Select } from "components/react-hook-form/select";
// import { useQuerySysCodes } from "../queries/sys-code.query";
import { useRouter } from "next/router";

export interface SelectOptionProps {
  key: any;
  label?: any;
  value: any;
}

type SelectProps = {
  id: string;
  type: string;
  label: string;
<<<<<<< HEAD
  options? : SelectOptionProps[] | undefined;
=======
  options? : SelectOptionProps[] ;
>>>>>>> f9fd4392f6e796d166d24ca8a30803b0c381885b
  value?: string;
  defaultValue?:string;
  placeholder?: string;
  width?: string;
  children?: any;
  allYn?: boolean;
  readOnly?: boolean;
  isAdd?: boolean;
  isRequired?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  isPlaceholder?: boolean;
  isModal?: boolean;
};

export const TSelectCode: React.FC<SelectProps> = ({
  id,
  type,
  label,
  options,
  value,
  defaultValue,
  placeholder,
  width = "w-full",
  children,
  allYn = false,
  readOnly = false,
  isAdd = false,
  isRequired = false,
  onChange,
  isPlaceholder = true,
  isModal = false,
}) => {



  let labelColorCss = "text-gray-700";

  if (isAdd && !readOnly) {
    labelColorCss = "text-slate-500";
  }
  if (isRequired && !readOnly) {
    labelColorCss = "text-indigo-700";
  }

  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className={`block text-[13px] font-medium ${labelColorCss} whitespace-nowrap`}>
        {label}
      </label>
      <Select
        id={id}
        name={id}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        width={width}
        options={options}
        readOnly={readOnly}
        onChange={onChange}
        isPlaceholder={isPlaceholder}
      />
      {children}
    </div>
  );
};
