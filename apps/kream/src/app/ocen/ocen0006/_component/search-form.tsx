'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import  {PageSearch2}  from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

type Props = {
  // onSubmit: SubmitHandler<any>;
  // initData: any | undefined;
};

// const SearchForm = memo(({initData}:Props) => {
const SearchForm: React.FC<Props> = (props) => {
  const { dispatch } = useAppContext();

  const methods = useForm({
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

  useEffect(() => {
    onSearch();
  }, [])

  const onRefresh = () => { dispatch({ isMSearch: true }) }


  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true, mSelectedRow: null });
  }

  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

  const onSave = () => {
    const params = getValues();
    log("OCEN0006 onSave", params)
  }

  return (
    <FormProvider {...methods}>
      <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
        <PageSearch2
          right={
            <>
              <Button id={"interface"} onClick={onInterface} width={`w-24`} />
              <Button id={"search"} onClick={onSearch} width={`w-24`}/>
              <Button id={"save"} onClick={onSave} width={`w-24`}/>
            </>
          }>
          <></>
        </PageSearch2>
      </form>
    </FormProvider>
  );
};

export default SearchForm