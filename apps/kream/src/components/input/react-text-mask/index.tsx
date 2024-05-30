
import React, { ChangeEvent, KeyboardEventHandler, FocusEvent, memo, useEffect, useState } from 'react';
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

const { log } = require('@repo/kwe-lib/components/logHelper');


type Props = {
  id: string;
  label?: string;
  value?: string;
  width?: string;
  lwidth?: string;
  height?: string;
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
  };

  events?: {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: KeyboardEventHandler<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  }
};

export const MaskedInputField: React.FC<Props> = (props: Props) => {
  const { control, setValue } = useFormContext();
  const { t } = useTranslation();
  if (!control) return null;

  const { id, label, value, width, lwidth, height, options = {}, events } = props;
  const { type, myPlaceholder, inline, isReadOnly = false, noLabel = false, useIcon = false,
    textAlign, bgColor, textAlignLB, fontSize = "[13px]", fontWeight = "normal",
    freeStyles = '', radius = 'none', outerClassName = ''
  } = options;
  const { mask, pipe, placeholder } = getMask(type, options);

  const [selectedVal, setSelectedVal] = useState<string | undefined>(value || undefined);

  const defWidth = width ? width : "w-full";
  const defHeight = height ? height : "h-8";

  useEffect(() => {
    // log("MaskedInputField useEffect", id, value, selectedVal);
    setValue(id, value);
    setSelectedVal(value === undefined ? '' : value);
  }, [value])

  function handleKeyDown(e: any) {
    try {
      if (e.key === "Enter") {
        const form = e.target.form;
        // log(e.target, form);
        const index = [...form].indexOf(e.target);
        // log(index)
        form[index + 1].focus();
        e.preventDefault();
      }

      if (events?.onKeyDown) {
        events.onKeyDown(e);
      }
    } catch (ex) {

    }
  }

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    log("handleBlur", e.target.value);
    // if (type === 'number' && event.target.value) {
    //   const newVal = event.target.value.replace(/,/g, "");
    //   event.target.value = parseFloat(newVal).toLocaleString('ko-KR').toString();
    // }

    if (events?.onBlur) {
      events.onBlur(e);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    log("handleChange", e?.target?.value)

    setValue(id, e?.target?.value);
    setSelectedVal(e?.target?.value);

    if (events?.onChange) {
      events.onChange(e);
    }
  }

  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    log("handleChange", e.target?.value)

    setValue(id, e?.target?.value);
    setSelectedVal(e?.target?.value);

    if (events?.onChange) {
      events.onChange(e);
    }
  }

  return (
    <InputWrapper outerClassName={outerClassName} inline={inline}>
      {!noLabel && <Label id={id} name={label} lwidth={lwidth} textAlignLB={textAlignLB} />}
      <div className={`flex w-full ${outerClassName}`}>
        <Controller
          name={id}
          control={control}
          // defaultValue = {val}
          render={({ field }) => (
            <MaskedInput
              // {...field} //bg-${bgColor}
              className={clsx(`form-input block ${defWidth} ${defHeight} ${bgColor} border-gray-200 disabled:bg-gray-300 flex-grow-1
                 focus:border-blue-500 focus:ring-0 text-${fontSize} font-${fontWeight} rounded-${radius} read-only:bg-gray-100 
                 dark:bg-gray-900 dark:text-white dark:border-gray-700
                 ${freeStyles}
                 text-${textAlign}
                 `)}
              mask={mask!}
              // pipe={pipe}
              value={selectedVal}
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
    case "time":
      return {
        placeholder: "",
        mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/, ':', /\d/, /\d/,]
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

