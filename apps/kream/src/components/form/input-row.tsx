import { Input } from "components/react-hook-form/input-row";
import { HTMLInputTypeAttribute } from "react";
import { OnChangeValue } from "react-select";
import { Label } from "components/label"
import { InputWrapper } from "components/wrapper"

export type InputProps = {
  id: string;
  name: string;
  width?: string;
  children?: any;
  readOnly?: boolean;
  isAdd?: boolean;
  notAppliedReadOnlyCss?: boolean;
  type?: HTMLInputTypeAttribute;
  value?: any;
  rules?: any;
  nolabel?: boolean;
};

export const TInput2: React.FC<InputProps> = ({
  id,
  name,
  width = "w-full",
  children,
  readOnly = false,
  isAdd = false,
  notAppliedReadOnlyCss = false,
  type = "text",
  value,
  rules = {},
  nolabel,
}) => {
  return (
    <>
      {/* <label
        htmlFor={id}
        className={`w-full md:text-right mx-1 py-2 max-w-24`}>
        {id}
      </label> */}
      <InputWrapper inline={true}>
        { !nolabel &&
          <Label id={id} {...(name && { name: name })} />
        }
        {/* <div className='flex flex-col w-full '> */}
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
      </InputWrapper>
    </>
  );
};


