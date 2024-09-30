import { HTMLInputTypeAttribute, ChangeEventHandler, useEffect, useState, KeyboardEventHandler, FormEventHandler, FocusEventHandler, FocusEvent } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx"
import { InputWrapper } from "components/wrapper";
import { Label } from "components/label";

const { DateToString, stringToDateString } = require('@repo/kwe-lib/components/dataFormatter');
const { log } = require('@repo/kwe-lib/components/logHelper')

export type InputProps = {
  id: string;
  label?: string;
  width?: string;
  height?: string;
  value?: string;                    //yyyymmdd, yyyy/mm/dd, yyyy-mm-dd, yyyy mm dd 만 허용
  options?: {
    readOnly?: boolean;  
    placeholder?: string;
    inline?:boolean
    rules?: Record<string, any>;
    noLabel?:boolean;
  };
  events?: event
  
};

export type event = {
  onChange?:ChangeEventHandler<HTMLInputElement>;
  onInput?: FormEventHandler<HTMLInputElement> | undefined;
  onKeyDown?:KeyboardEventHandler<HTMLInputElement> | undefined;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  onFocus?: FocusEventHandler<HTMLInputElement>;
}

export const DateInput: React.FC<InputProps> = (props) => {
  const { register, setValue, getValues } = useFormContext();

  const { id, label, value, width, height,  options = {}, events } = props;
  const { placeholder, inline = false, rules = {}, noLabel = false, readOnly} = options;

  const [selectedVal, setSelectedVal] = useState(stringToDateString(value) || DateToString(new Date()));

  // rules = { valueAsNumber: true };가 정상적으로 동작하지 않아서 수정, 다음 링크 참고
  // https://github.com/react-hook-form/react-hook-form/issues/3630#issuecomment-1191247987
  // rules = { 
  //   ...rules,
  //   valueAsDate: false 
  //   };


  function handleKeyDown(event:any){
    if (event.key === "Enter") {
        const form = event.target.form;
        const index = [...form].indexOf(event.target);
        // log(index)
        form[index + 1].focus();
        event.preventDefault();
    } 
    // else {
    //   log("handleKeyDown", event);
    // }

    if (events?.onKeyDown) {
      events.onKeyDown(event);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // log("handleChange", e.target.value, getValues());
    setValue(id, e.target.value);
    // setSelectedVal({value:e.value, label:e.label});
    setSelectedVal(e.target.value);

    if (events?.onChange) {
        events.onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    log("handleBlur", e.target.value, getValues());
    e.target.type = "date"
    // handle blur event logic here, if needed
    setSelectedVal(e.target.value); // onBlur 이벤트에서 값 업데이트
    if (events?.onBlur) {
      events.onBlur(e); // 추가 작업 수행
    }
  }
 
  const handleInput = (e:any) => {
    log("handleInput", e.value);
    setValue(id, e.value);
    // setSelectedVal({value:e.value, label:e.label});
    setSelectedVal(e.value);

    if (events?.onChange) {
        events.onChange(e);
    }
  }

  const handleFocus = (e:FocusEvent<HTMLInputElement>) => {
    e.target.type = "text"

    if (events?.onFocus) {
      events.onFocus(e);
    }
  }

  return (
    <InputWrapper outerClassName="" inline={inline}>
        <Label id={id} name={label}  />
        <input
        id={id}
        className={clsx(`form-input block ${width} ${height} disabled:bg-gray-300
            bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}
        value={selectedVal}
        type="date"
        max="9999-12-31"
        readOnly={readOnly}
        placeholder={placeholder}
        autoComplete="on"        
        {...register(id, rules)}
        // onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleBlur}
        // onInput={handleInput}
        onFocus={handleFocus}
        />
    </InputWrapper>
  );  
};



