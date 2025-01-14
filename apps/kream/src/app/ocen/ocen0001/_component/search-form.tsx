'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import  {PageSearch2}  from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "@/components/provider/contextObjectProvider";

import { log, error } from '@repo/kwe-lib-new';

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

type Props = {
  // onSubmit: SubmitHandler<any>;
  // initData: any | undefined;
};

const SearchForm: React.FC<Props> = () => {
  const { dispatch } = useAppContext();

  const methods = useForm({
    // resolver: zodResolver(formSchema),
    // defaultValues: {
    //   ...initSearchValue,
    // }
  });

  const {
    getValues,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    onSearch();
  }, [])

  const onRefresh = () => { dispatch({ isMSearch: true }) }


  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    // log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true, mSelectedRow: null });
  }
  
  const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }


  return (
    <FormProvider {...methods}>
      <form /*onSubmit={handleSubmit(onSubmit)}*/ className="space-y-1">
        <PageSearch2
        // addition={"border m-1"}
          right={
            <>
              <Button id={"search"} onClick={onSearch} width={`w-32`}/>
              <Button id={"interface"} onClick={onInterface}  width={`w-32`}/>
              {/* <Button id={"refresh"} onClick={onRefresh} width={`w-32`}/> */}
            </>
          }>
          <></>
        </PageSearch2>
      </form>
    </FormProvider>
  );
};

export default SearchForm