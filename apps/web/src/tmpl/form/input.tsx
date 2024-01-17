import { Input } from "components/react-hook-form/input";
import { HTMLInputTypeAttribute } from "react";

export type InputProps = {
  id: string;
  label: string;
  width?: string;
  children?: any;
  readOnly?: boolean;
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
  isAdd = false,
  notAppliedReadOnlyCss = false,
  type = "text",
  value,
  rules = {},
}) => {
  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className={`block text-xs font-medium ${
          isAdd ? "text-orange-400" : "text-gray-700"
        } whitespace-nowrap`}>
        {label}
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


