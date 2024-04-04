import { HTMLInputTypeAttribute, ChangeEventHandler, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx"
import { InputWrapper } from "../wrapper";
import { Label } from "../label";

export type InputProps = {
  id: string;
  name?: string;
  type?: HTMLInputTypeAttribute;
  rules?: Record<string, any>;
  readOnly?: boolean;
  isAdd?: boolean;
  width?: string;
  height?: string;
  placeholder?: string;
  value?: any;
  isCircle?: boolean;
  notAppliedReadOnlyCss?: boolean;
  handleChange?:ChangeEventHandler<HTMLInputElement>,
  inline?:boolean
};

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  rules = {},
  readOnly,
  isAdd = false,
  notAppliedReadOnlyCss = false,
  width = "w-full",
  height,
  placeholder = "",
  isCircle,
  value,
  inline = false
}) => {
  const { register, setValue, getValues } = useFormContext();
  // rules = { valueAsNumber: true };가 정상적으로 동작하지 않아서 수정, 다음 링크 참고
  // https://github.com/react-hook-form/react-hook-form/issues/3630#issuecomment-1191247987
  const numberOnlyRegex = /[^0-9]/g;
  const stringToNumberFunc = (id: string) => {
    const originText = getValues()[id];
    const numberOnlyText = originText.replace(numberOnlyRegex, "");
    setValue(id, numberOnlyText);
  };
  let readOnlyCss;
  if (type === "number") {
    // rules = { valueAsNumber: true };
    rules = {
      onChange: () => {
        stringToNumberFunc(id);
      },
    };
  }
  if (type === "date") {
    // valueAsdate = false로 변경 (yyyy/mm/dd format read)
    rules = { valueAsDate: false };
  }

  function handleKeyDown(event:any){
    if (event.key === "Enter") {
        const form = event.target.form;
        const index = [...form].indexOf(event.target);
        // log(index)
        form[index + 1].focus();
        event.preventDefault();
      }
  }
 

  return (
    <InputWrapper outerClassName="" inline={inline}>
        <Label id={id} name={name}  />
        <input
        {...register(id, rules)}
        placeholder={placeholder}
        autoComplete="on"
        type={type}
        readOnly={readOnly}
        value={value}
        id={id}
        width={width}
        disabled={isCircle}
        className={clsx(`form-input block ${width} ${height} disabled:bg-gray-300
            bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded`)}
        onKeyDown={handleKeyDown}
        />
    </InputWrapper>
  );  
};



