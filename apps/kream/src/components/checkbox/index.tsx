import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputWrapper } from 'components/wrapper';
import { Label } from 'components/label';

export type CheckboxProps = {
  id: string;
  // name?: string;
  label?: string;
  value?: "Y" | "N"
  rules?: Record<string, any>;
  readOnly?: boolean;
  isDisplay ?: boolean;
  options?:{
      inline?:boolean;
      noLabel?: boolean;
  }
  events?: {
    onClick?: any;
    onChange?: any;
  }
};

export const Checkbox: React.FC<CheckboxProps> = (props : CheckboxProps) => {
  const { register, getValues, setValue } = useFormContext();
  const { t } = useTranslation();

  const {
    id,    // name,
    label,    value,    isDisplay=true,    rules = {},    options={},    events,    readOnly = false,
  } = props
  const { inline, noLabel = false } = options
  const [ checkVal, setChceckVal ] = useState(false);

  //event.target.checked 동작오류로 주석처리
  // useEffect(() => {
  //   let isChecked = value === 'Y' ? true : false
  //   //log('???', value, isChecked)
  //   setChceckVal(isChecked);
  //   setValue(id, value);
  // }, [value])

  return (
    <InputWrapper outerClassName={` ${isDisplay && isDisplay ? '' : 'invisible'} `} inline={inline} >
      {!noLabel && <Label id={id} name={label === null ? '' : label} isDisplay={isDisplay} />}
    <div className="flex w-full p-1 m-1 space-x-3 space-y-2">
      <div className="flex items-center h-6 justify-stretch">
        <input
          {...register(id, rules)}
          id={id}
          // name={name?name:id}
          checked={checkVal}
          type="checkbox"
          className="items-center w-6 h-6 text-blue-600 bg-center bg-no-repeat border-gray-300 rounded form-checkbox focus:outline-none focus:ring-offset-0 focus:ring-2"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (readOnly) return;            
            setChceckVal(e.target.checked);
            setValue(id, e.target.checked ? 'Y' : 'N');
            if (events?.onChange) {
              //events.onChange(e);
              events.onChange(id, checkVal)
            }
              
          }}
          />
      </div>
      {/* <div className="space-y-1 text-sm">
        <div className="block font-medium text-gray-700 shrink-0 whitespace-nowrap">{t(label?label:id)}</div>
      </div> */}
    </div>
    </InputWrapper>
  );
};
