import { Input } from "components/react-hook-form/input"
import { HTMLInputTypeAttribute } from "react";

export type InputProps = {
  id: string;
  label: string;
  width?: string;
  children?: any;
  readOnly?: boolean;
  isRequired?: boolean;
  isAdd?: boolean;
  notAppliedReadOnlyCss?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: any;
  rules?: any;
};

export const TInput: React.FC<InputProps> = ({
  id,
  label,
  width = "w-full",
  children,
  readOnly = false,
  isRequired = false,
  isAdd = false,
  notAppliedReadOnlyCss = false,
  type = "text",
  value,
  rules = {},
}) => {

  let labelColorCss = "text-gray-700"

  if (isAdd && !notAppliedReadOnlyCss) {
    labelColorCss = "text-yellow-600"
  }

  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className={`block text-[13px] font-medium ${labelColorCss} whitespace-nowrap`}>
        {label}
        {
          isRequired &&
          <span className="font-extrabold text-red-700"> * </span>
        }
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        width={width}
        value={value}
        readOnly={readOnly}
        isAdd={isAdd}
        notAppliedReadOnlyCss={notAppliedReadOnlyCss}
        rules={rules}
      />
      {children}
    </div>
  );
};
