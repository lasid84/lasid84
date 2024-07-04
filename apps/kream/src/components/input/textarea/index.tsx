import { HTMLInputTypeAttribute, ChangeEventHandler, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx"
import { InputWrapper } from "components/wrapper";
import { Label } from "components/label";

const { log } = require('@repo/kwe-lib/components/logHelper')

export type TextareaProps = {
  id: string;
  name?: string;
  value?: any;
  rows: number;
  cols: number;
  rules?: Record<string, any>;
  options?: {
    isReadOnly?: boolean;
    placeholder?: string;
    isCircle?: boolean;
    inline?: boolean
    fontWeight?: string;
    bgColor?: string;
    freeStyles?: string;
    radius?: string;
    fontSize?: string;
    textAlign?: string;
  }
  events?: {
    handleChange?: ChangeEventHandler<HTMLInputElement>,
  }
};

export const TextArea: React.FC<TextareaProps> = (props: TextareaProps) => {
  const { register, setValue, getValues } = useFormContext();


  const { id, name, value, rows, cols, rules, options = {}, events } = props
  const { isReadOnly, placeholder, isCircle, inline, fontWeight = "normal",
    freeStyles = '', radius = 'none', bgColor, fontSize = "[13px]", textAlign } = options
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  function handleKeyDown(event: any) {
    // if (event.key === "Enter") {
    //   const form = event.target.form;
    //   const index = [...form].indexOf(event.target);
    //   // log(index)
    //   form[index + 1].focus();
    //   event.preventDefault();
    // }
    // log(event)
    // event.preventDefault();
    setText(event.target.value);
  }

  const handleChange = (e:any) => {
    log(e.target.value)
    setText(e.target.value);
  };


  return (
    <InputWrapper outerClassName="" inline={inline}>
      <div className='w-full row'>
        <Label id={id} name={name} />
        <textarea
          {...register(id, rules)}
          placeholder={placeholder}
          autoComplete="on"
          rows={rows}
          cols={cols}
          readOnly={isReadOnly}
          value={text}
          id={id}
          // disabled={isCircle}
          className={clsx(`form-input block ${bgColor} border-gray-200 disabled:bg-gray-300 flex-grow-1
        focus:border-blue-500 focus:ring-0 text-${fontSize} text-${textAlign} font-${fontWeight} rounded-${radius} read-only:bg-gray-100 
        dark:text-white dark:border-gray-800 dark:bg-gray-900
        ${freeStyles}
        `)}
          // onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </div>
    </InputWrapper>

  )
}

