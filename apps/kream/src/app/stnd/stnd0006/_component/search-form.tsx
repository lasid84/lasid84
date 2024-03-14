'use client'

import { useTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search-row";
import { TInput2, TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextProvider";
import { shallow } from "zustand/shallow";
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

  log("search-form 시작", Date.now());
  const { dispatch } = useAppContext();

  // 다국어
  const { t } = useTranslation();

  //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  // const methods = useForm<FormType>({
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

  // //Set select box data
  const [transmode, setTransmode] = useState([])
  const [transtype, setTranstype] = useState([])

  useEffect(() => { 
    if(loadItem){
      // log("=================", loadItem[0].data, loadItem[1].data)
      setTransmode(loadItem[0].data) 
      setTranstype(loadItem[1].data)

      onSearch();
    }    
  }, [loadItem])

  const onSubmit = () => {
    const params = getValues();
    // dispatch({ type: SEARCH, params: params});
  }

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params)
    dispatch({ searchParams: params, isMSearch:true});
  }

  const onNew = () => {
    // dispatch({ type: SELECTED_ROW, selectedRow: null});
    dispatch({ mSelectedRow: null, crudType:crudType.CREATE, isPopUpOpen:true});
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <PageSearch
          right={
            <>
              <TButtonBlue label={t("search")} onClick={onSearch} />
              <TButtonBlue label={t("new")} onClick={onNew}/>
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
            {/* {errors?.trans_mode?.message && <ErrorMessage>{errors.trans_mode.message}</ErrorMessage>} */}
            <TSelect2
              id="trans_type"
              label={t("trans_type")}
            //   allYn={false}
              isPlaceholder={false}
              outerClassName="w-full space-y-1"
              defaultValue={gTransType}
              options={transtype}
            />
          {/* {errors?.trans_type?.message && <ErrorMessage>{errors.trans_type.message}</ErrorMessage>} */}
          </div>
        </PageSearch>
      </form>
    </FormProvider>
  );
});


export default SearchForm