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
import { Store } from "../_store/store";
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
  // const { dispatch, objState } = useAppContext();
  // const { getValues, handleSubmit, reset } = useFormContext();
  // const { searchParams } = objState;
  // const {
  //   fr_date,
  //   to_date,
  //   search_gubn,
  //   no,
  //   state,
  // } = searchParams;
  const state = Store((state) => state);
  const actions = Store((state) => state.actions);

  // //Set select box data
  const [status, setStatus] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      setStatus(loadItem[1]);
    }    
  }, [loadItem]);


  // useEffect(() => {
  //   const params = getValues();
  //   dispatch({ searchParams: params, isMSearch: true });
  // }, [])

  // const onSearch = () => {
  //   const params = getValues();
  //   dispatch({ searchParams: params, isMSearch: true});
  // };

  // function handleKeyDown(e: KeyboardEvent) {
  //   if (e.key === "Enter") {
  //     onSearch();
  //   }
  // }

  // const onReset = () => {
  //   reset();
  //   const params = getValues();
  //   dispatch({ searchParams: params});

  // }
  
  // const onChange = (e: any) => {
  //   const value = parseInt(e.target.value, 10);
  //   searchParams.search_gubn = value
  // }

  useEffect(()=>{
    onSearch()
  },[])

  const onSearch = () =>{
    const params = getValues()
    // dispatch({ searchParams: params, isMSearch: true});
    log("onSeach", params)
    actions.getAppleDatas(params)
  }

  const onReset = () =>{}

  function handleKeyDown(e:KeyboardEvent) {}

  const onChange = () => {}

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

          <div className={"col-span-1 border"}>
            <RadioGroup label="search_gubn" >
              <Radio id ="search_gubn" name="search_gubn" value="0" label="810_receive_dd" onChange={onChange} defaultChecked/>
              <Radio id ="search_gubn" name="search_gubn" value="1" label="858_send_dd" onChange={onChange} />              
            </RadioGroup>
          </div>

          <div className={"col-span-1"}>
            <DatePicker
              id="fr_date"
              label="fr_date"
              value={state.searchParams?.fr_date}
              options={{
                inline: true,
                textAlign: "center",
                freeStyles: "p-1 border-1 border-slate-300",
              }}
              lwidth="w-20"
              height="h-8"
            />
            <DatePicker
              id="to_date"
              label="to_date"
              value={state.searchParams?.to_date}
              options={{
                inline: true,
                textAlign: "center",
                freeStyles: "border-1 border-slate-300",
              }}
              lwidth="w-20"
              height="h-8"
            />
          </div>
          <div className={"col-span-2"}>           
            <MaskedInputField
              id="no"
              label="mwb_hwb"
              value={state.searchParams?.no}
              options={{ textAlign: "center", inline: true, noLabel: false }}
              height="h-8"
              events={{
                onKeyDown: handleKeyDown,
                onFocus(e) {
                    e.target.select();
                },
              }}
            />
          </div>

          <div className={"col-span-1"}>
           
            <ReactSelect
              id="state"
              label="state"
              dataSrc={status as data}
              width="w-96"
              lwidth="w-20"
              height="8px"
              options={{
                keyCol: "state",
                displayCol: ["state_nm"],
                inline: true,
                defaultValue: state.searchParams?.state,
              }}
            />
          </div>
        </PageSearchButton>
        </div>
  );
};

export default SearchForm;
