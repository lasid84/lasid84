'use client'

import { useTranslation } from "react-i18next";
import React, { useState, memo, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import PageSearch, {PageSearchButton} from "layouts/search-form/page-search-row";
import { Button } from 'components/button';
import { useUserSettings } from "states/useUserSettings";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { shallow } from "zustand/shallow";
import { DatePicker } from "@/components/date";
import dayjs from 'dayjs'

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
  const { dispatch, objState } = useAppContext();
  const { fr_date, to_date } = objState.searchParams;
  
  log("ufms0003 search", fr_date, to_date, dayjs().subtract(1, 'month').startOf('month').format("YYYYMMDD"));
  // const methods = useForm<FormType>({
  const methods = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      fr_date: fr_date || dayjs().format("YYYYMMDD"),
      to_date: to_date || dayjs().format("YYYYMMDD"),
    }
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
    const params = getValues();
    dispatch({ searchParams: params});
    onSearch();
  }, [])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params, getValues());
    dispatch({ searchParams: params, isMSearch:true});
  }

  const onUpload = () => {

  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(() => {})} className="space-y-1">
        <PageSearchButton
          right={
            <>
              <Button id={"search"} onClick={onSearch} />
            </>
          }>
          <DatePicker id="fr_date" value={fr_date} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
          <DatePicker id="to_date" value={to_date} options={{ inline: true, textAlign: 'center', freeStyles: "border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm