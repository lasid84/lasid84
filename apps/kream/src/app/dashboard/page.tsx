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
import { FormProvider, useForm } from "react-hook-form";

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


  const onClick = () => {
    log("onClick~~~~~~~~~~~~~~~~~~~~~~~~~");
  }

  const onSubmit = (data: any) => {
    console.log(data);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Input 
            id="trans_type"
            name="zz"
            type="number" 
            width="800px"
          /> */}
          <MaskedInputField 
            id="bz_reg_no" 
            value="1248"
            width="w-80"
            // height="h-12"
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
          <PageContent
            right={
              <>
                <Button 
                  label={"search"}
                  // color="white"
                  disabled={false}
                  // isHidden={true}
                  onClick={onClick}
                />
                <Button 
                  label={"add"}
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