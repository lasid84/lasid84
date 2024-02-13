import { Input } from "components/react-hook-form/input";
import { HTMLInputTypeAttribute } from "react";
import { FiSearch } from "react-icons/fi";

type InputProps = {
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
    onClick?: any;
  };


export const TInputWithButton: React.FC<InputProps> = ({
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
    onClick,
  }) => {
    return (
      <div className="w-full space-y-1">
        <label
          htmlFor={id}
          className={`block text-[13px] font-medium ${
            isAdd ? "text-orange-400" : "text-gray-700"
          } whitespace-nowrap`}>
          {label}
        </label>
        <div className="relative cursor-pointer">
          <Input
            id={id}
            name={id}
            type={type}
            value={value}
            readOnly={readOnly}
            isAdd={isAdd}
            notAppliedReadOnlyCss={notAppliedReadOnlyCss}
            rules={rules}
            width={width}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={onClick}>
            <FiSearch size={15} className="text-gray-800" onClick={onClick} />
          </div>
        </div>
        {children}
      </div>
    );
  };
  