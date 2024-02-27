import { HTMLInputTypeAttribute, ChangeEventHandler } from "react";
import { useFormContext } from "react-hook-form";

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
  notAppliedReadOnlyCss?: boolean;
  handleChange?:ChangeEventHandler<HTMLInputElement>
};

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type,
  rules = {},
  readOnly = false,
  isAdd = false,
  notAppliedReadOnlyCss = false,
  width = "w-full",
  height = "h-8",
  placeholder = "",
  value  
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
      onChange: () => {
        stringToNumberFunc(name);
      },
    };
  }
  if (type === "date") {
    // valueAsdate = false로 변경 (yyyy/mm/dd format read)
    rules = { valueAsDate: false };
  }
  if (readOnly && !notAppliedReadOnlyCss) {
    readOnlyCss = "read-only:bg-gray-100";
  }
  return (
    <input
      {...register(name, rules)}
      placeholder={placeholder}
      type={type}
      name={name}
      readOnly={readOnly}
      value={value}
      id={id}
      width={width}
      className={`form-input block ${width} ${height} ${readOnlyCss} ${
        isAdd ? "border-orange-400" : "border-gray-300"
      } bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded`}
    />
  );  
};



