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
          {/* <DateInput 
            id="fr_date"
            width="w-58"
            height="h-8"
            value="20240312"
          /> */}
          <MaskedInputField 
            id="bz_reg_no" 
            value="1248.12"
            width="w-80"
            // height="h-20"
            options = {{ 
              type:"number",
              limit:7,
              isAllowDecimal:true,
              decimalLimit:2,
              // myPlaceholder:"Enter business number" 
            // myPlaceholder:"bz_reg_no"
            // inline:{true}
              // isReadOnly:true
            }}
            />
          <ReactSelect 
            id="trans_mode" label="trans_mode" dataSrc={{data:[{trans_mode:'A', name : 'Air'},{trans_mode:'O', name : 'Ocean'}], field:[]} as data} 
            width="10" height="15px"
            options={{
              keyCol:"trans_mode",
              displayCol:['name'],
              // inline:true,
              // defaultValue: {label:'A Air', value:'A'}
              defaultValue : getValues('trans_mode')
            }}
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
          {/* <NextDatePicker
          /> */}
          <PageContent
            right={
              <>
                <Button 
                  id="search"
                  // label={"search"}
                  // color="white"
                  disabled={false}
                  // isHidden={true}
                  onClick={onClick}
                />
                <Button 
                  id="add"
                  // label={"add"}
                  // color="white"
                  disabled={false}
                  // isHidden={true}
                  type="submit"
                />
              </>
            }>  
            <></>            
          </PageContent>
        </form>
      </FormProvider>
  );
}

export default Home;