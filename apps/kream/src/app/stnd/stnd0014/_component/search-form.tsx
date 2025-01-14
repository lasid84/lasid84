'use client'

import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import PageSearch, { PageSearchButton } from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { DatePicker } from "@/components/date/react-datepicker";
import RadioGroupField from "@/components/radio/mui/muiRadioGroup";

import { log, error } from '@repo/kwe-lib-new';

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

// export function SearchForm({searchParams, dispatch}) {
const SearchForm = memo(({ loadItem }: any) => {

  const { dispatch, objState } = useAppContext();
  const { searchParams } = objState;
  const { getValues } = useFormContext();

  useEffect(() => {
    log("searchparam", loadItem, loadItem?.length)
    if (loadItem?.length) {
      // setTransmode(loadItem[0])

      onSearch();
      // onSubmit();
      // handleSubmit(onSubmit)();
    }
  }, [loadItem?.length])

  useEffect(() => {
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }, [])

  const onSearch = () => {
    const params = getValues();
    dispatch({ searchParams: params, isMSearch: true });
  }

  const onSave = () => {
    const params = getValues();
    
  }
  return (
      <PageSearchButton
        right={
          <>
            <Button id={"search"} onClick={onSearch} width='w-24'/>
          </>
        }>
        <div className={"col-span-1"}>
          <DatePicker id="year" value={getValues("year")} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 underline border-1 border-slate-300", dateFormat: 'yyyy' }} lwidth='w-20' height="h-8" />
        </div>
        <RadioGroupField
              id="type"
              dataSrc={[
                { value : '', label:'ALL'},
                { value : 'Y', label:'holiday'}
              ]}
              noLabel= {true}
              onClick={(e) => {
                dispatch({ searchParams: {...getValues(), type:e.value}, isMSearch: true });
              }}
            />
      </PageSearchButton>
  );
});


export default SearchForm