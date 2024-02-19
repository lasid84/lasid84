'use client'

import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { useAppContext } from "components/contextAPI/contextProvider";
import { SEARCH } from "./model";
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData : []
  numericData : number;
  textData : string;
}

export interface typeloadItem {
  data : {} | undefined
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem : typeloadItem;
};

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({loadItem}:any) => {

  const { dispatch, needSearch } = useAppContext();

    // 다국어
    const { t } = useTranslation();
    z.setErrorMap(makeZodI18nMap({ t }));
  // 인보이스 검색스키마
  const acct3002SearchSchema = z.object({
    trans_mode: z.coerce.string(),
    trans_type: z.coerce.string(),
  })

  // acct3002검색스키마 선언
  const formSchema = acct3002SearchSchema
  // acct3002검색스키마 타입선언
  type FormType = z.infer<typeof acct3002SearchSchema>

  //사용자 정보
  const gOfficeId = useUserSettings((state) => state.data.office_cd)
  const gTransMode = useUserSettings((state) => state.data.trans_mode)
  const gTransType = useUserSettings((state) => state.data.trans_type)

  const methods = useForm<FormType>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   ...initSearchValue,
    // }
  });

  const {
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
    register,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  // //Set select box data
  const [transmode, setTransmode] = useState([])
  const [transtype, setTranstype] = useState([])

  useEffect(() => { 
    if(loadItem){
      
      setTransmode(loadItem[0]) 
      setTranstype(loadItem[1])

      onSubmit();
    }    
  }, [loadItem])

  const onSubmit = () => {
    const params = getValues();
    // log("onSubmit", params)
    dispatch({ type: SEARCH, params: params});
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TSubmitButton label={t("search")} />
              <TCancelButton label={t("reset")}onClick={() => {
                setFocus("trans_mode");
                reset();
              }} />
            </>
          }>
          <div>
            <TSelect2
              id="trans_mode"
              label={t("trans_mode")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransMode}
              options={transmode}
            />
            {errors?.trans_mode?.message && <ErrorMessage>{errors.trans_mode.message}</ErrorMessage>}
            <TSelect2
              id="trans_type"
              label={t("trans_type")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransType}
              options={transtype}
            />
          {errors?.trans_type?.message && <ErrorMessage>{errors.trans_type.message}</ErrorMessage>}
          </div>
        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default SearchForm