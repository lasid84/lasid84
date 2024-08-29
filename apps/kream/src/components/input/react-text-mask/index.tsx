
import React, { ChangeEvent, KeyboardEventHandler, FocusEvent, memo, useEffect, useState, KeyboardEvent, useRef, forwardRef, useImperativeHandle } from 'react';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput, { Mask, MaskedInputProps, conformToMask } from 'react-text-mask';
import { SlMagnifierAdd } from "react-icons/sl";
import { FcExpand } from "react-icons/fc";
// import  conformToMask from './conformToMask'
import { InputWrapper } from 'components/wrapper';
import { Label } from 'components/label';
import clsx from 'clsx';
import createNumberMask from './createNumberMask';

const { log, error } = require('@repo/kwe-lib/components/logHelper');


type Props = {
  id: string;
  label?: string | undefined | null;
  value?: string;
  width?: string;
  lwidth?: string;
  height?: string;
  isFocus?:boolean
  options?: {
    inline?: boolean;         //라벨명 위치
    type?: string;            //number, text,  custom: ipaddr, bz_reg_no
    limit?: number;           //입력 자릿수 제한
    isAllowDecimal?: boolean,  //소수점 허용 여부
    decimalLimit?: number     //소수점 자리수
    myPlaceholder?: string;   //
    /* Tailwind Style */
    bgColor?: string;         //Background Color (ingerit, current, transparent, black, white, slate-50......)
    fontSize?: string;        //Font Size (xs, sm, base, lg, xl, 2xl......)
    fontWeight?: string;      //Font Weight (thin, extralight, ligth, normal, medium, semibold, bold ......)
    textAlign?: string;       //Text Align (left, center, right)
    textAlignLB?: string;
    radius?: string;          //Border Radius (none, sm, '', md, lg, xl, 2xl, full, ......)
    freeStyles?: string;       //freestyle

    isReadOnly?: boolean;      //읽기전용여부
    noLabel?: boolean;
    useIcon?: boolean;
    outerClassName?: string;    //outerClassName
    isAutoComplete?: string;
    isDisplay ?: boolean;      //사용자 권한에 따른 display여부
    isNotManageSetValue? : boolean; //값 변경시 setValue 처리 여부
  };

  events?: {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  }
};

export const MaskedInputField: React.FC<Props> = (props: Props) => {
  // const MaskedInputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { control, setValue, setFocus, getValues } = useFormContext();
  const { t } = useTranslation();
  // if (!control) return null;
  const localRef = useRef<HTMLInputElement | null>(null);

  const { id, label, value = '', width, lwidth, height, options = {}, events, isFocus=false } = props;
  const { type, myPlaceholder, inline, isReadOnly = false, noLabel = false, useIcon = false,
    textAlign, bgColor, textAlignLB, fontSize = "[13px]", fontWeight = "normal",
    freeStyles = '', radius = 'none', outerClassName = '', isAutoComplete='new-password',
    isDisplay=true, isNotManageSetValue=false
  } = options;
  const { mask, pipe, placeholder } = getMask(type, options);
  // log("===MaskedInputField", type, mask);
  const [selectedVal, setSelectedVal] = useState<string | undefined>(value || undefined);

  const defWidth = width ? width : "w-full";
  const defHeight = height ? height : "h-8";

  useEffect(() => {
    // log("MaskedInputField useEffect", id, value, selectedVal);
    if (id && !isNotManageSetValue) setValue(id, value);
    setSelectedVal(value);
  }, [value])

  useEffect(() => {
    // log("isFocus ",isFocus, id, localRef?.current)
    if (isFocus) {
      // setFocus(id);
      if(localRef?.current) (localRef.current as HTMLInputElement)?.focus();
    }
  }, [isFocus])

  function handleKeyDown(e: any) {
    try {
      if (e.key === "Enter") {
        const form = e.target.form;
        let index = [...form].indexOf(e.target);
        // log("form[index + 1]", form[index + 1])

        //필드셋과 버튼은 포커스 제외 - stephen
        while ((form[index + 1] instanceof HTMLButtonElement) 
          || (form[index + 1] instanceof HTMLFieldSetElement) 
          || (form[index + 1].readOnly === true)
        ) index++;
        
        // log(form.length, index)
        if (form.length > index + 1) form[index + 1].focus();
        e.preventDefault();
      }

      if (events?.onKeyDown) {
        events.onKeyDown(e);
      }
    } catch (ex) {
      error(ex)
    }
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    // log("handleBlur", e.target.value);
    // if (type === 'number' && event.target.value) {
    //   const newVal = event.target.value.replace(/,/g, "");
    //   event.target.value = parseFloat(newVal).toLocaleString('ko-KR').toString();
    // }

    if (events?.onBlur) {
      events.onBlur(e);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    // log("handleChange", e?.target?.value)

    if (id && !isNotManageSetValue) {
      // log("handleChange in if", id, e?.target?.value.replaceAll(":", ""))
      setValue(id, e?.target?.value.replaceAll(":", ""));
    }
    setSelectedVal(e?.target?.value);

    if (events?.onChange) {
      events.onChange(e);
    }
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    log("handleFocus", e.target?.value, getValues(id))

    // if (id && !isNotManageSetValue) setValue(id, e?.target?.value);
    // setSelectedVal(e?.target?.value);

    // if (!getValues(id)) setSelectedVal(getValues(id));

    if (events?.onFocus) {
      events.onFocus(e);
    }
  }

  return (
    <InputWrapper outerClassName={outerClassName} inline={inline}>
      {!noLabel && <Label id={id} name={label === null ? '' : label} lwidth={lwidth} textAlignLB={textAlignLB} isDisplay={isDisplay} />}
      <div className={`flex w-full ${outerClassName} ${defWidth}`}>
        <Controller
          name={id}
          control={control}
          // defaultValue = {val}
          render={({ field }) => (
            <MaskedInput
              {...field}
              id={id}
              type={type === 'password' ? type : ''}
              // {...field} //bg-${bgColor}
              className={clsx(`form-input block ${defWidth} ${defHeight} ${bgColor} border-gray-200 disabled:bg-gray-300 flex-grow-1
                focus:border-blue-500 focus:ring-0 text-${fontSize} font-${fontWeight} rounded-${radius} read-only:bg-gray-100 
                dark:bg-gray-900 dark:text-white dark:border-gray-700
                ${freeStyles}
                text-${textAlign}
                `)}
              mask={type === 'password' ? false : mask!}
              {...(isNotManageSetValue ? { value: selectedVal } : {})}
              defaultValue={value}
              readOnly={isReadOnly}
              placeholder={t(myPlaceholder ? myPlaceholder! : placeholder!) as string}
              // onChange={(e) => {
              //     // log(name, e.target.value)
              //     // setValue(name, e.target.value);
              // }}
              guide={false}
              // showMask={true}
              onKeyDown={(e) => handleKeyDown(e)}
              onBlur={(e) => handleBlur(e)}
              onChange={(e: any) => { handleChange(e); }}
              onFocus={(e: any) => { handleFocus(e); }}
              autoComplete={isAutoComplete}
              render={(textMaskRef, props) => (
                <input
                  {...props}
                  ref={(node:HTMLInputElement) => {
                    textMaskRef(node); // Keep this so the component can still function
                    localRef.current = node as HTMLInputElement; // Copy the ref for yourself
                  }}
                />
              )}
            />
          )}
        />
        {useIcon && <div className='flex px-1 py-1 item-center'><FcExpand size="24" /></div>}
      </div>
    </InputWrapper>
  );
};



function getMask(type: string = "", options: any = {}): Partial<MaskedInputProps> {
  var maskArray = [];
  switch (type.toLowerCase()) {
    case "ipaddr":
      return (
        {
          placeholder: "",
          mask: ((value: string) => Array(value.length).fill(/[\d.]/)),
          pipe: (value: string) => {
            if (value === '.' || value.endsWith('..')) return false;

            const parts = value.split('.');

            if (parts.length > 4 || parts.some((part: string | number) => part === '00' || +part < 0 || +part > 255)) {
              return false;
            }

            return value;
          },
        }
      );
    case "bz_reg_no":
      return (
        {
          placeholder: "",
          mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
        }
      );
    case "number":
      return {
        // mask: (value: string) => {
        //   const num = (parseInt(value.replace(/[^0-9.]/g,''))).toString();
        //   const length = num.length;
        //   const decimal = parseFloat(value) % 1;
        //   const maskArray: (string | RegExp)[] = [];
        //   for (let i = 0; i < length; i++) {
        //     if (i != 0 && i%3 === 0) maskArray.push(',');
        //     maskArray.push(/\d/);
        //   }
        //   maskArray.reverse();
        //   log(num, length, options.isAllowDecimal, options.decimalCnt)
        //   if (options.isAllowDecimal && value.includes('.')) {
        //     maskArray.push('.');
        //     if (decimal.toString().length > 0) {              
        //       decimal.toString().split('').forEach((_, i) => {
        //         if (options.decimalCnt) {
        //           if (options.decimalCnt > i) maskArray.push(/\d/);
        //         } else {
        //           maskArray.push(/\d/);
        //         }
        //       });
        //     }
        //   }
        //   return maskArray;
        // },
        // mask: (value: string) => {
        //   const maskArray: (string | RegExp)[] = [];
        //   var newVal = value.replace(/,/g, "");

        //   const length = newVal.length;
        //   for (let i = 0; i < length; i++) {
        //     if (options.limit && options.limit <= i) return maskArray;
        //     if (options.isAllowDecimal && newVal.charAt(i) === '.') {
        //       maskArray.push('.');
        //     } else {
        //       if (options.decimalCnt) {
        //         var idx = maskArray.indexOf('.') + 1;
        //         // log(idx, maskArray.slice(idx))
        //         if (idx && maskArray.slice(idx).length >= options.decimalCnt) return maskArray;
        //       }

        //       maskArray.push(/\d/);
        //     }
        //   }

        //   return maskArray;
        // },
        mask: createNumberMask({
          allowDecimal: options.isAllowDecimal,
          decimalLimit: options.decimalLimit,
          integerLimit: options.limit
        }),
        // pipe: (value: string) => {
        //   // return parseFloat(value).toLocaleString('ko-KR').toString();
        //   log(document.activeElement, document.activeElement?.tagName.includes('bz_reg_no'))
        //   if (!document.activeElement || document.activeElement.tagName.toLowerCase() !== 'input') {
        //     return parseFloat(value).toLocaleString('ko-KR').toString();
        //   }

        //   return value;
        // },
      };
    case "text":
      return {
        mask: (value: string) => {
          const length = value.length;
          const maskArray: (string | RegExp)[] = [];
          for (let i = 0; i < length; i++) {
            // log(options.limit, options.limit < i, i)
            if (options.limit && options.limit <= i) return maskArray;
            maskArray.push(/[^\d]/);
          }
          return maskArray;
        },
      };      
    case "date":
      return {
        placeholder: "",
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/,]
      }
    case "time":
        return {
          //아래는 추가 설정 기능 필요
          placeholder: "",
          mask: [/\d/, /\d/, ':', /\d/, /\d/]
        }
    case "password":
      return {
        // mask: (value:string) => {
        //   let arr = Array(value.length).fill('*');
        //   log("maskedit password", value, arr);
        //   return arr;
        // }
        mask: [/\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/, /\w/]
      }
    default:
      return {
        placeholder: "",
        mask: (value: string) => {
          const length = value.length;
          const maskArray: (string | RegExp)[] = [];
          for (let i = 0; i < length; i++) {
            // log(options.limit, options.limit < i, i)
            if (options.limit && options.limit <= i) return maskArray;
            maskArray.push(/^.*$/);
          }
          return maskArray;
        }
      };
  }
}

