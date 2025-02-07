"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  KeyboardEvent
} from "react";
import { FormProvider, SubmitHandler, useFormContext } from "react-hook-form";
import PageSearch, {
  PageSearchButton,
} from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from "components/input";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from "components/date";
import { Button } from "components/button";
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
  const actions = useCommonStore((state) => state.actions);

  const [status, setStatus] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      setStatus(loadItem[0]);
    }    
  }, [loadItem]);

  useEffect(()=>{
    onSearch()
  },[])

  const onSearch = () =>{
    const params = getValues()
    actions.getDTDDatas(params)
  }

  const onReset = () =>{}

  function handleKeyDown(e:KeyboardEvent) {}

  const handleChange = useCallback(
    (e: any, id: any, date: any) => {
      const params = getValues();
      actions.setSearchState(params)
      log("params", searchParams);
    },
    [searchParams]
  );

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
              label="settlement_date"
              value={state.searchParams?.fr_date}
              events={{
                onChange: handleChange,
              }}
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
              id="create_user"
              label="create_user"
              dataSrc={status as data}
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
          </div>
        </PageSearchButton>
        </div>
  );
};

export default SearchForm;
