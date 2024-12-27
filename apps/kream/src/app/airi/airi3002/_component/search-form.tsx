"use client";

import { useTranslation } from "react-i18next";
import React, {
  useState,
  useEffect,
  KeyboardEvent
} from "react";
import { FormProvider, SubmitHandler, useFormContext } from "react-hook-form";
import PageSearch, {
  PageSearchButton,
} from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { MaskedInputField, Input } from "components/input";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from "components/date";
import dayjs from "dayjs";
import { Button } from "components/button";
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
import { useCommonStore } from "../_store/store";
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: [];
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined;
}

type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

const SearchForm = ({ loadItem }: any) => {
  
  const { getValues, handleSubmit, reset } = useFormContext();
  
  const state = useCommonStore((state) => state);
  const searchParams = useCommonStore((state) => state.searchParams);
  
  const { setState, resetSearchParam, getAppleDatas } = useCommonStore((state) => state.actions);

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
          
          <div className={"col-span-1"}>
            <DatePicker
              id="fr_date"
              label="fr_date"
              value={searchParams?.fr_date}
              options={{
                inline: true,
                textAlign: "center",
                freeStyles: "p-1 border-1 border-slate-300",
              }}
              lwidth="w-20"
              height="h-8"
            />
          </div>
          <div className={"col-span-2"}>
            <MaskedInputField
              id="no"
              label="waybill_no"
              value={searchParams?.no}
              options={{ textAlign: "center", inline: true, noLabel: false }}
              height="h-8"
            />
          </div>
        </PageSearchButton>
        </div>
  );
};

export default SearchForm;
