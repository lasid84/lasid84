"use client";

import React, { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { FormProvider, SubmitHandler, useFormContext } from "react-hook-form";
import PageSearch, {
  PageSearchButton,
} from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from "components/input";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from "components/date";
import { Button, ICONButton } from "components/button";
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
  const state = useCommonStore((state) => state);

  const searchParams = useCommonStore((state) => state.searchParams);
  const actions = useCommonStore((state) => state.actions);
  const [settlementUser, setSettlementUser] = useState<any>();
  const [logis, setLogis] = useState<any>();
  const [broker, setBroker] = useState<any>();
  const [dtdfh, setDTDFH] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      setSettlementUser(loadItem[0]);
      setLogis(loadItem[3]);
      setBroker(loadItem[4]);
      setDTDFH(loadItem[5]);
    }
  }, [loadItem]);

  useEffect(() => {
    onSearch();
  }, []);

  useEffect(() => {
    onSearch();
  }, [searchParams]);

  const onSearch = () => {
    const params = getValues();
    log("getValues_PARAMS?", params);
    actions.getDTDDatas(params);
  };

  const onReset = () => {};

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      onSearch();
    }
  }

  const handleChange = useCallback(
    (e: any, id: any, date: any) => {
      const params = getValues();
      actions.setSearchState(params);
    },
    [searchParams]
  );

  // “접기/펼치기” 버튼
  const handleToggle = () => {
    actions.setUiData({
      isCollapsed: !state.uiData.isCollapsed,
    });
  };

  return (
    <div>
      <PageSearchButton
        right={
          <>
            <ICONButton
              id="fold"
              disabled={false}
              onClick={handleToggle}
              size={"24"}
            />
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
          />
          <DatePicker
            id="to_date"
            label="to_date"
            value={searchParams?.to_date}
            events={{
              onChange: handleChange,
            }}
            options={{
              inline: true,
              textAlign: "center",
              freeStyles: "border-1 border-slate-300",
            }}
          />
        </div>
        <div className={"col-span-2"}>
          <MaskedInputField
            id="no"
            label="mwb_hwb"
            value={searchParams?.no}
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
            id="logis_id"
            dataSrc={logis as data}
            lwidth="w-20"
            options={{
              keyCol: "logis_id",
              displayCol: ["logis_nm"],
              inline: true,
              defaultValue: searchParams?.logis_id,
            }}
          />
          <ReactSelect
            id="broker_id"
            dataSrc={broker as data}
            lwidth="w-20"
            options={{
              keyCol: "broker_id",
              displayCol: ["broker_nm"],
              inline: true,
              defaultValue: searchParams?.broker_id,
            }}
          />
        </div>
        <div className={"col-span-1"}>
          <ReactSelect
            id="settlement_user"
            dataSrc={settlementUser as data}
            lwidth="w-20"
            options={{
              keyCol: "settlement_user",
              displayCol: ["settlement_user_nm"],
              inline: true,
              defaultValue: searchParams?.settlement_user,
            }}
            events={{
              onChange: handleChange,
            }}
          />
          <ReactSelect
            id="dtd_fh"
            dataSrc={dtdfh as data}
            lwidth="w-20"
            options={{
              keyCol: "dtd_fh",
              displayCol: ["dtd_fh_nm"],
              inline: true,
              defaultValue: searchParams?.dtd_fh,
            }}
          />
        </div>
      </PageSearchButton>
    </div>
  );
};

export default SearchForm;
