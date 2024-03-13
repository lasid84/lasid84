'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "@/components/provider/contextProvider";
import { SEARCH_M } from "components/provider/contextProvider";
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData : []
  numericData : number;
  textData : string;
}

type Props = {
  // onSubmit: SubmitHandler<any>;
  initData : any | undefined;
};

const SearchForm = memo(({initData}:Props) => {

  // log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();

  // //사용자 정보
  // const gTransMode = useUserSettings((state) => state.data.trans_mode)
  // const gTransType = useUserSettings((state) => state.data.trans_type)

  const methods = useForm({
    // resolver: zodResolver(formSchema),
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

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    // log("onSearch", params);
    dispatch({ type: SEARCH_M, searchParams: params, isMSearch:true});
  }

  return (
    <FormProvider {...methods}>
      <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
        <PageSearch
          right={
            <>
              <TButtonBlue label={"search"} onClick={onSearch} />
              {/* <TButtonBlue label={t("new")} onClick={() => { } } /> */}
              {/* <TCancelButton label={t("reset")} onClick={() => { } } /> */}
            </>
          }>
            <></>
        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default SearchForm