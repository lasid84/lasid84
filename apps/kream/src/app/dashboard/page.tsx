// 'use server'
'use client'

import { setI18n } from "components/i18n/i18n";
import { useConfigs } from "states/useConfigs";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import CustomSelect from './_component/test';
import { FaChevronDown } from "react-icons/fa";
import { TButtonMove, TButtonHideBlue, TButtonRefresh, TButtonKart, TButtonGrayDisabled, TButtonRedDisabled, TButtonRed } from "@/components/form/button";
import { Button } from 'components/button';
import PageContent from "@/layouts/search-form/page-content";
import { MaskedInputField, Input } from 'components/input';
import { DateInput, DatePicker } from 'components/date'
import { FormProvider, useForm } from "react-hook-form";
import { ReactSelect, data } from "components/select/react-select2";
import NextDatePicker from "components/date/next-tui-date-picker";
import MaskedInput from "react-text-mask";
import createNumberMask from "@/components/input/react-text-mask/createNumberMask";


const { log } = require('@repo/kwe-lib/components/logHelper');

const Home: React.FC = () => {
  const { t } = useTranslation();
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
    register,
    control,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    setFocus("fr_date");
  }, [])

  const onClick = (e:any) => {
    log("onClick~~~~~~~~~~~~~~~~~~~~~~~~~", e);
  }

  const onSubmit = (data: any) => {
    console.log(data);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>

          <MaskedInputField 
            id="bz_reg_no" 
            value="12444444448"
            width="w-80"
            // height="h-20"
            options = {{ 
              type:"number",
              limit:7,
              isAllowDecimal:true,
              decimalLimit:2,
              textAlign:"right"
              // myPlaceholder:"Enter business number" 
            // myPlaceholder:"bz_reg_no"
            // inline:{true}
              // isReadOnly:true
            }}
            />
            <MaskedInputField 
            id="num" 
            value="12444444448"
            width="w-80"
            // height="h-20"
            options = {{ 
              type:"number",
              fontSize:"[13px]",
              textAlign:"right"
            }}
            />
          <MaskedInput
                // {...field} //bg-${bgColor}
                className={`form-input block border-gray-200 disabled:bg-gray-300 flex-grow-1
                 focus:border-blue-500 focus:ring-0 text-${'[13px]'} font-${'normal'} read-only:bg-gray-100 
                 text-right
                 `}
                 value={'12444444448'}
                 mask={
                  createNumberMask({
                    allowDecimal: true,
                    decimalLimit: undefined,
                    integerLimit: null
                  })
                 }
                />
          
          <DatePicker 
            id={"to_date"} value="20240330" 
            options={{
              inline:true,
              textAlign:'center',
              // fontSize:''
              // bgColor:"blue-100",
              // textAlign:"right",
              // fontSize:"15px",
              // fontBold:"light"
              // radius:"full",
              freeStyles:"underline border-1 border-slate-300"
            }}
            // height="h-20"
          />

        </form>
      </FormProvider>
  );
}

export default Home;