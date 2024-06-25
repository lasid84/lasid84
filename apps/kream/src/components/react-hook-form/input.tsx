import { HTMLInputTypeAttribute, ChangeEventHandler, useEffect, KeyboardEventHandler, useRef, InputHTMLAttributes  } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx"

export type InputProps = {
  id: string;
  name: string;
  type: HTMLInputTypeAttribute;
  rules?: Record<string, any>;
  readOnly?: boolean;
  isAdd?: boolean;
  width?: string;
  height?: string;
  placeholder?: string;
  value?: any;
  isCircle?: boolean;
  notAppliedReadOnlyCss?: boolean;
  onChange?:ChangeEventHandler<HTMLInputElement>
  onKeyDown?: (e:React.KeyboardEvent<HTMLInputElement>) => void
  ref?: any
};

interface ChildComponentProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  rules = {},
  readOnly,
  isAdd = false,
  notAppliedReadOnlyCss = false,
  width = "w-full",
  height = "h-8",
  placeholder = "",
  isCircle,
  value, 
  ref,
  onKeyDown
}) => {
  const { register, setValue, getValues } = useFormContext();
  // rules = { valueAsNumber: true };가 정상적으로 동작하지 않아서 수정, 다음 링크 참고
  // https://github.com/react-hook-form/react-hook-form/issues/3630#issuecomment-1191247987
  const numberOnlyRegex = /[^0-9]/g;
  const stringToNumberFunc = (name: string) => {
    const originText = getValues()[name];
    const numberOnlyText = originText.replace(numberOnlyRegex, "");
    setValue(name, numberOnlyText);
  };
  let readOnlyCss;
  if (type === "number") {
    // rules = { valueAsNumber: true };
    rules = {
      ...rules,
      onChange: () => {
        stringToNumberFunc(name);
      },
      // onKeyDown: (e:React.KeyboardEvent<HTMLInputElement>) => {
      //   if (onKeyDown) onKeyDown(e);
      // }
    };
  }
  if (type === "date") {
    // valueAsdate = false로 변경 (yyyy/mm/dd format read)
    rules = { ...rules, valueAsDate: false };
  }
 
  const handleKeyDown = (e: any) => {

    if (e.key === "Enter") {
      const form = e.target.form;
      // log(e.target, form);
      const index = [...form].indexOf(e.target);
      // log(index)
      form[index + 1].focus();
      e.preventDefault();
    }

    if (onKeyDown) onKeyDown(e)
  }

  return (
    <input
      {...register(name, rules)}
      placeholder={placeholder}
      autoComplete="on"
      type={type}
      name={name}
      readOnly={readOnly}
      value={value}
      id={id}
      width={width}
      disabled={isCircle}
      onKeyDown={handleKeyDown}
      className={clsx(`form-input block ${width} ${height} disabled:bg-gray-300
        bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded`)}
      // ref={ref}
    />
  );  
};



