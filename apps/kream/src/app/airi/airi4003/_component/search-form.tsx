"use client";

import React, {
  useState,
  useEffect,
  // useCallback,
  KeyboardEvent,
} from "react";

import { gridData } from "components/grid/ag-grid-enterprise";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { PageSearchButton } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from "components/input";
import { DatePicker } from "components/date";
import { Button } from "components/button";
import Radio from "components/radio/index";
import RadioGroup from "components/radio/RadioGroup";

import CustomSelect from "components/select/customSelect";
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
  const [custcode, setCustcode] = useState<any>();

  const { getValues } = useFormContext();

  const searchParams = useCommonStore((state) => state.searchParams);

  const { resetSearchParam, getMainDatas } = useCommonStore(
    (state) => state.actions
  );

  useEffect(() => {
    onSearch();
  }, []);
  useEffect(() => {
    if (loadItem) {
      setCustcode(loadItem[1]);
    }
  }, [loadItem]);

  const onSearch = () => {
    const params = getValues();
    
    getMainDatas(params);
  };

  const onReset = () => {
    resetSearchParam();
  };

  function handleKeyDown(e: KeyboardEvent) {}
  
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
        {/* <div className={"col-span-1 border"}>
            <RadioGroup label="search_gubn" >
              <Radio id ="search_gubn" name="search_gubn" value="0" label="delivery_request_dd" onChange={onChange} defaultChecked/>
              <Radio id ="search_gubn" name="search_gubn" value="1" label="unload_dd" onChange={onChange} />              
            </RadioGroup>
          </div> */}

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
            value={searchParams?.no || ""}
            options={{ textAlign: "center", inline: true, noLabel: false }}
            height="h-8"
            events={{
              onKeyDown: handleKeyDown,
              onFocus(e) {
                e.target.select();
              },
            }}
          />
          <CustomSelect
            id="cnee_id"
            label="l_cnee_id"
            initText="Select a Consignee"
            listItem={custcode as gridData}
            valueCol={["cust_code"]}
            displayCol="cust_nm"
            lwidth="8"
            gridOption={{
              colVisible: {
                col: ["cust_code", "cust_nm", "bz_reg_no"],
                visible: true,
              },
            }}
            gridStyle={{ width: "600px", height: "300px" }}
            style={{ width: "1200px", height: "8px" }}
            isDisplay={true}
            inline={true}
          />
        </div>
      </PageSearchButton>
    </div>
  );
};

export default SearchForm;
