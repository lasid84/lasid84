"use client";

import { useTranslation } from "react-i18next";
import React, {
  useState,
  useEffect,
  Dispatch,
  useContext,
  memo,
  useMemo,
} from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch, {
  PageSearchButton,
} from "layouts/search-form/page-search-row";
import {
  TSelect2,
  TCancelButton,
  TSubmitButton,
  TButtonBlue,
} from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from "components/input";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from "components/date";
import dayjs from "dayjs";
import CustomSelect from "components/select/customSelect";
import { Button } from "components/button";
import { gridData } from "components/grid/ag-grid-enterprise";
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
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
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const {
    trans_mode,
    trans_type,
    fr_date,
    to_date,
    wb_no,
    cust_code,
    state,
    // bk_id,
    // doc_fr_dt,
    // doc_to_dt,
    search_gubn,
  } = objState.searchParams;

  //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow);
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow);

  const methods = useForm({
    defaultValues: {
      trans_mode: trans_mode || gTransMode || "ALL",
      trans_type: trans_type || gTransType || "ALL",
      fr_date:
        fr_date ||
        dayjs().subtract(4, "month").startOf("month").format("YYYYMMDD"),
      to_date:
        to_date ||
        dayjs().subtract(0, "month").endOf("month").format("YYYYMMDD"),
      wb_no: wb_no || "", // HWB, MWB, BK_NO
      cust_code: cust_code || "",
      state: "",
      create_user: "",
      search_gubn: 0,
    },
  });

  const {
    handleSubmit,
    reset,
    setFocus,
    setValue,
    getValues,
    register,
    trigger,
    formState: { errors, isSubmitSuccessful },
  } = methods;

  // //Set select box data
  const [createuser, setCreateuser] = useState<any>();
  const [status, setStatus] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      setCustcode(loadItem[0]);
      setCreateuser(loadItem[1]);
      setStatus(loadItem[2]);
      dispatch({ isFirstRender: false });
      if (objState.isFirstRender) {
        onSearch();
      }
    }
  }, [loadItem?.length]);


  const onSearch = () => {
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true, mGridState:null });
  };
  
  const onChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
     setValue(e.target.name, value)
     if (value === 0) {
       setValue("fr_date", dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"));
       setValue("to_date", dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"));
    } else if (value === 1) {
      setValue("fr_date", dayjs().subtract(4, "month").startOf("month").format("YYYYMMDD"));
      setValue("to_date", dayjs().subtract(0, "month").endOf("month").format("YYYYMMDD"));
    }
    trigger()
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="flex pt-10 space-y-1">
        <PageSearchButton
          right={
            <>
              <div className={"col-span-1"}>
                <Button id="search" disabled={false} onClick={onSearch} />
              </div>
              <div className={"col-span-1"}>
                <Button id="reset" disabled={false} onClick={onSearch} />
              </div>
            </>
          }
        >

          <div className={"col-span-1 border"}>
            <RadioGroup label="search_gubn" >
              <Radio name="search_gubn" value="0" label="doc_close_dd" onChange={onChange} defaultChecked/>
              <Radio name="search_gubn" value="1" label="create_date" onChange={onChange} />
            </RadioGroup>
          </div>

          <div className={"col-span-1"}>
            <DatePicker
              id="fr_date"
              label="fr_date"
              value={getValues("fr_date")}
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
              value={getValues("to_date")}
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
            <CustomSelect
              id="cust_code"
              initText="Select an option"
              listItem={custcode as gridData}
              valueCol={["cust_code", "cust_nm", "bz_reg_no"]}
              displayCol="cust_nm"
              gridOption={{
                colVisible: {
                  col: ["cust_code", "cust_nm", "bz_reg_no"],
                  visible: true,
                },
              }}
              gridStyle={{ width: "600px", height: "300px" }}
              style={{ width: "1000px", height: "8px" }}
              isDisplay={true}
              inline={true}
            />
            <MaskedInputField
              id="wb_no"
              label="mwb_hwb_bk"
              value={wb_no}
              options={{ textAlign: "center", inline: true, noLabel: false }}
              height="h-8"
            />
            <MaskedInputField
              id="cust_nm"
              value={objState.searchParams?.cust_nm}
              options={{
                textAlign: "center",
                inline: true,
                noLabel: false,
                outerClassName: "hidden",
              }}
              height="h-8"
            />
          </div>

          <div className={"col-span-1"}>
            <ReactSelect
              id="create_user"
              label="create_user"
              dataSrc={createuser as data}
              width="w-96"
              lwidth="w-20"
              height="8px"
              options={{
                keyCol: "create_user",
                displayCol: ["create_user_nm"],
                inline: true,
                defaultValue: getValues("create_user"),
              }}
            />
            <ReactSelect
              id="state"
              label="state"
              dataSrc={status as data}
              width="w-96"
              lwidth="w-20"
              height="8px"
              options={{
                keyCol: "state",
                displayCol: ["state", "state_nm"],
                inline: true,
                defaultValue: getValues("state"),
              }}
            />
          </div>
        </PageSearchButton>
      </form>
    </FormProvider>
  );
};

export default SearchForm;
