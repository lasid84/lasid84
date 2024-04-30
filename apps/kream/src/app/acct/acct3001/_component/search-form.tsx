'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch from "layouts/search-form/page-search";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";
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

// const SearchForm = memo(({initData}:Props) => {
const SearchForm: React.FC<Props> = (props) => {
  const { dispatch } = useAppContext();

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

  useEffect(() => {
    onSearch();
  }, [])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({searchParams: params, isMSearch:true, mSelectedRow:null});
  }

  return (
    <FormProvider {...methods}>
      <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
        <PageSearch
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
            </>
          }>
            <></>
        </PageSearch>
      </form>
    </FormProvider>
  );
};

export default SearchForm