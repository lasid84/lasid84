import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InputWrapper } from 'components/wrapper';
import { Label } from 'components/label';

import { log, error } from '@repo/kwe-lib-new';

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

  useEffect(() => {
    let isChecked = value === 'Y' ? true : false
    // log('???checkbox', id, value, isChecked)
    setChceckVal(isChecked);
    setValue(id, value);
  }, [value])

  const  handleKeyDown =  (e:any)=>{
    try {
        if(e.key ==="Enter"){          
        e.preventDefault();  // 기본 엔터 동작을 막음
        const form = e.target.form.elements;
        var index = Array.prototype.indexOf.call(form, e.target);

        //필드셋과 버튼은 포커스 제외 - stephen
        while ((form[index + 1] instanceof HTMLButtonElement) 
          || (form[index + 1] instanceof HTMLFieldSetElement) 
          || (form[index + 1].readOnly === true)
        ) index++;

        // 다음 요소가 input일 경우 포커스 이동
        if (form[index + 1]) {
            form[index + 1].focus();
        }
        }
    }catch (ex) {
      error(ex)
    }

  }

  return (
    <InputWrapper outerClassName={` ${isDisplay && isDisplay ? '' : 'invisible'} `} inline={inline} >
      {!noLabel && <Label id={id} name={label === null ? '' : label} isDisplay={isDisplay} />}
    <div className="flex w-full p-1 m-1 space-x-3 space-y-2">
      <div className="flex items-center h-6 justify-stretch">
        <input
          {...register(id, rules)}
          id={id}
          // name={name?name:id}
          // checked={checkVal}
          defaultChecked={false}
          type="checkbox"
          className="items-center flex-shrink-0 w-6 h-5 text-blue-600 bg-center bg-no-repeat border-gray-300 rounded form-checkbox focus:outline-none focus:ring-offset-0 focus:ring-2"
          onKeyDown={handleKeyDown}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (readOnly) return;

            // log("checkBox", e.target.checked, checkVal);
            setChceckVal(e.target.checked);
            setValue(id, e.target.checked);
            if (events?.onChange) {
              events.onChange(id, e.target.checked ===true ? 'Y' : 'N')
            }
              
          }}
          />
      </div>
    </div>
    </InputWrapper>
  );
};
