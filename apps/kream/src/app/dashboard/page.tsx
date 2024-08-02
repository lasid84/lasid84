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
import { Checkbox } from 'components/checkbox'


const { log } = require('@repo/kwe-lib/components/logHelper');

// 개발 이력 데이터
const developmentHistory = [
  {
    date: '2024-07-25',
    title: 'Version 0.1.0 Released',
    description: '1. Charge Upload <br>' 
     + '&nbsp;1) 엑셀 업로드 후 저장 클릭하도록 변경<br>'
     + '&nbsp;2) 인보이스 발행 기능 적용<br>'
     + '&nbsp;&nbsp;- invoice date 가 없을 경우 발행 안됨<br>'
     + '&nbsp;3) 연동되는 UFS+ 사이트(테스트 사이트)<br>'
     + '&nbsp;&nbsp;- https://uat-jp.ufsplus.kwe.com/web/<br>'
     + '&nbsp;4) 인보이스 컨펌 기능 개발 중<br>'
  },
];


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

  const onSubmit = (data: any) => {
    console.log(data);
  };
  
  const onClick = (data: any) => {
    console.log("onClick", data);
    
  }
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center min-h-screen bg-gray-100">
            <header className="w-full p-4 text-center text-white bg-blue-600">
              <h1 className="text-2xl font-bold">Development History</h1>
            </header>
            {/* <div>
              <Checkbox id="ck" onClick={onClick}/>
            </div> */}
            <main className="flex-grow w-full max-w-4xl p-6">
              <div className="space-y-6">
                {developmentHistory.map((entry, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800">{entry.title}</h2>
                    <p className="text-sm text-gray-500">{entry.date}</p>
                    <p 
                      className="mt-2 text-gray-700"
                      dangerouslySetInnerHTML={{ __html: entry.description }}
                    />
                  </div>
                ))}
              </div>
            </main>
          </div>
        </form>
      </FormProvider>
  );
}

export default Home;