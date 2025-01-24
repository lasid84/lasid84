"use client";

import React, {
  useEffect,
  KeyboardEvent
} from "react";
import {  SubmitHandler, useFormContext } from "react-hook-form";
import  {  PageSearchButton } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from "components/input";
import { DatePicker } from "components/date";
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

  const { getValues } = useFormContext();

  const searchParams = useCommonStore((state) => state.searchParams);
  
  const {  resetSearchParam, getTransportDatas, getLoad } = useCommonStore((state) => state.actions);


  useEffect(()=>{
    onSearch()
  },[])

  const onSearch = () =>{
    const params = getValues()
    getTransportDatas(params)
  }

  const onReset = () =>{
    resetSearchParam()
  }

useEffect(() => {
  log('searchParams', searchParams)
  //getLoad(getValues());
}, [searchParams]);

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
              <Radio id ="search_gubn" name="search_gubn" value="0" label="delivery_request_dd" onChange={onChange} defaultChecked/>
              <Radio id ="search_gubn" name="search_gubn" value="1" label="unload_dd" onChange={onChange} />              
            </RadioGroup>
          </div>

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
             <DatePicker
              id="to_date"
              label="to_date"
              value={searchParams?.to_date}
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
              value={searchParams?.no|| ""}
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

          {/* <div className={"col-span-1"}>           
            <ReactSelect
              id="create_user"
              dataSrc={createuser as data}
              width="w-96"
              lwidth="w-20"
              height="8px"
              options={{
                keyCol: "create_user",
                displayCol: ["create_user_nm"],
                inline: true,
                defaultValue: state.searchParams?.state,
              }}
            />
          </div> */}
          
        </PageSearchButton>
        </div>
  );
};

export default SearchForm;
