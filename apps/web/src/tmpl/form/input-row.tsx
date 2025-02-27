import { Input } from "components/react-hook-form/input-row";
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

export const TInput2: React.FC<InputProps> = ({
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
    <div className="flex flex-row items-start mx-1">
      <label
        htmlFor={id}
        className={`w-full md:text-right mx-1 py-2`}>
        {label}
      </label>
      {/* <div className='w-full flex flex-col '> */}
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
      {/* </div> */}
    </div>
  );
};


