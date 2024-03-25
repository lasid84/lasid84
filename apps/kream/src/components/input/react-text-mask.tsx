
import React, { KeyboardEventHandler, memo, useEffect, useState } from 'react';
import { useFormContext, Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import MaskedInput, { Mask, MaskedInputProps } from 'react-text-mask';
import { InputWrapper } from '../wrapper';
import { Label } from '../label';
import clsx from 'clsx';

const { log } = require('@repo/kwe-lib/components/logHelper');


type Props = {
  id:string;
  label?:string;
  value?:string;
  width?:string;
  height?:string;

  options?: {
    inline?: boolean;         //라벨명 위치
    type?: string;            //number, text,  custom: ipaddr, bz_reg_no
    limit?: number;           //입력 자릿수 제한
    isAllowDecimal?:boolean,  //소수점 허용 여부
    decimalCnt?: number       //소수점 자리수
    myPlaceholder?: string;   //
    isReadOnly?:boolean;       //읽기전용여부
  };
};

export const MaskedInputField: React.FC<Props> = memo((props:Props) => {
  const { control } = useFormContext();
  const { t } = useTranslation();
  if (!control) return null;

  const {id, label, value, width, height, options = {} } = props;
  const { type, myPlaceholder, inline, isAllowDecimal,decimalCnt, isReadOnly = false } = options;
  const {mask, pipe, placeholder} = getMask(type, options);
  const defWidth = width ? width : "w-full";
  const defHeight = height ? height : "h-8";

  function handleEnter(event:any){
    if (event.key === "Enter") {
        const form = event.target.form;
        const index = [...form].indexOf(event.target);
        // log(index)
        form[index + 1].focus();
        event.preventDefault();
      }
  }

  function handleBlur(event:any) {
    // log("handleBlur", event.target.value, defWidth, defHeight);
    if (type === 'number' && event.target.value) {
      const newVal = event.target.value.replace(/,/g, "");
      event.target.value = parseFloat(newVal).toLocaleString('ko-KR').toString();
    }
  }

  return (
    <InputWrapper outerClassName="" inline={inline}>
      <Label id={id} name={label}/>
      <Controller
          name = {id}
          control={control}
          // defaultValue = {val}
          render={({field}) => (
              <MaskedInput
                {...field}
                className={clsx(`form-input block ${defWidth} ${defHeight} disabled:bg-gray-300 bg-white flex-grow-1 focus:border-blue-500 focus:ring-0 text-[13px] rounded read-only:bg-gray-100`)}
                mask={mask! || false}
                pipe={pipe}
                value={value}
                readOnly={isReadOnly}
                placeholder={t(myPlaceholder ? myPlaceholder! : placeholder!) as string}
                // onChange={(e) => {
                //     // log(name, e.target.value)
                //     // setValue(name, e.target.value);
                // }}
                guide={false}
                // showMask={true}
                onKeyDown={(e) => handleEnter(e)}
                onBlur={(e) => handleBlur(e)}
                
              />
          )}
        />
    </InputWrapper>
  );
});



function getMask(type:string = "", options:any={}): Partial<MaskedInputProps>  {
  var maskArray = [];
  switch (type.toLowerCase()) {
    case "ipaddr":
      return (
        {
          placeholder: "",
          mask: ((value:string) => Array(value.length).fill(/[\d.]/)),
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
        mask: (value: string) => {
          const maskArray: (string | RegExp)[] = [];
          var newVal = value.replace(/,/g, "");
          
          const length = newVal.length;
          for (let i = 0; i < length; i++) {
            if (options.limit && options.limit <= i) return maskArray;
            if (options.isAllowDecimal && newVal.charAt(i) === '.') {
              maskArray.push('.');
            } else {
              if (options.decimalCnt) {
                var idx = maskArray.indexOf('.') + 1;
                // log(idx, maskArray.slice(idx))
                if (idx && maskArray.slice(idx).length >= options.decimalCnt) return maskArray;
              }
              
              maskArray.push(/\d/);
            }
          }
          
          return maskArray;
        },
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

