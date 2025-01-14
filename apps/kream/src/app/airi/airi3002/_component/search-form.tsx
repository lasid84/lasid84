"use client";

import React, {
  useState,
  useEffect,
  KeyboardEvent
} from "react";
import { FormProvider, SubmitHandler, useFormContext } from "react-hook-form";
import PageSearch, {
  PageSearchButton,
} from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from "components/input";
import { DateInput, DatePicker } from "components/date";
import { Button } from "components/button";
import { useCommonStore } from "../_store/store";

import { log, error } from '@repo/kwe-lib-new';

const SearchForm = () => {
  
  const { getValues, handleSubmit, reset } = useFormContext();
  
  const state = useCommonStore((state) => state);
  const searchParams = useCommonStore((state) => state.searchParams);
  
  const { setState, resetSearchParam, getAppleDatas, getLoad } = useCommonStore((state) => state.actions);

  useEffect(() => {
    onSearch();
  }, [])

  const onSearch = () => {
    const params = getValues();
    getAppleDatas(params);
  };

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      onSearch();
    }
  }

  const onReset = () => {
    resetSearchParam();
    getLoad();
    setState({mainDatas:{...state.mainDatas, data:[]}})
  }
  
  const onChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    searchParams.search_gubn = value
  }


  return (
      <div>
        <PageSearchButton
          right={
            <>
              <div className={"col-span-1"}>
                <Button id="search" disabled={false} onClick={onSearch} />
              </div>
              <div className={"col-span-1"}>
                <Button id="reset" disabled={false} onClick={onReset} />
              </div>
            </>
          }
        >
          
          <div className={"col-span-2"}>
            <DatePicker
              id="fr_date"
              label="fr_date"
              value={searchParams?.fr_date}
              options={{
                inline: true,
                textAlign: "center",
                freeStyles: "p-1 border-1 border-slate-300",
                isShowButton: true,
              }}
              lwidth="w-20"
              height="h-8"
              // width="w-200"
            />
          </div>
          
          <div className={"col-span-2"}>
            <MaskedInputField
              id="no"
              label="waybill_no"
              value={searchParams?.no}
              options={{ textAlign: "center", inline: true, noLabel: false }}
              height="h-8"
              events={{
                onKeyDown(e) {
                    if (e.key === "Enter" ) onSearch();
                },
              }}
            />
          </div>
        </PageSearchButton>
        </div>
  );
};

export default SearchForm;
