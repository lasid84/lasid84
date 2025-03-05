"use client";

import React, {
  useState,
  useEffect,
  Dispatch,
  useContext,
  memo,
  useMemo,
} from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
import CustomSelect from "components/select/customSelect";
import { Button } from "components/button";
import { gridData } from "components/grid/ag-grid-enterprise";
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"

import { log, error } from '@repo/kwe-lib-new';

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
  const { searchParams } = objState;
  const {
    // trans_mode,
    // trans_type,
    fr_date,
    to_date,
    no,
    cust_code,
    state,
    // bk_id,
    // doc_fr_dt,

    create_user,
    search_gubn,
  } = searchParams;

  //사용자 정보
  // const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow);
  // const gTransType = useUserSettings((state) => state.data.trans_type, shallow);
  const user_id = useUserSettings((state) => state.data.user_id);

  const methods = useForm({
    defaultValues: {
      fr_date:
        fr_date ||
        dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"),
      to_date:
        to_date ||
        dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"),
      no: no || "", // HWB, MWB, BK_NO
      cust_code: cust_code || "",
      state: state || "",
      create_user: "ALL",
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

      if (loadItem[1].data.filter((v:any) => v.create_user == user_id).length) {
        setValue("create_user", user_id);
        dispatch({searchParams: {...searchParams, create_user:user_id}});
      }
    }
    if (objState.isFirstRender) resetComponent(0);
  }, [loadItem, user_id]);

  useEffect(() => {
    // log("curCreateUser", objState.searchParams)
    if (searchParams?.create_user && objState.isFirstRender) {
      onSearch();
      dispatch({ isFirstRender: false });
    }
  }, [searchParams?.create_user])

  useEffect(() => {
    // log("useEffect userid", user_id, objState.isFirstRender, getValues("create_user"), searchParams)
    if (user_id && objState.isFirstRender) {
      dispatch({
        searchParams: {...searchParams, create_user: user_id}
      })
    }
  }, [user_id]);

  // useEffect(() => {
  //   let user = getValues("create_user");
  //   if (!user) {
  //     setValue("create_user", user);
  //   }
  //   log("useEffect getValues userid", user_id, user, getValues("create_user"))
  // }, [getValues("create_user")])

  // useEffect(() => {
  //   if (createuser && !objState.isFirstRender) {
  //     log("useEffect create_user", getValues('create_user'));
  //     if (createuser.data.some((v:any) => v.create_user === user_id)) {
  //       setValue("create_user", user_id);
  //     } else {
  //       setValue("create_user", 'ALL');
  //     }
  //   }
  // }, [createuser,objState.isFirstRender]);

  const resetComponent = (search_gubn : number) => {
    if (search_gubn === 0) {
      setValue("fr_date", dayjs().subtract(3, "days").startOf("days").format("YYYYMMDD"));
      setValue("to_date", dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"));
    } else if (search_gubn === 1) {
      setValue("fr_date", dayjs().subtract(1, "month").startOf("month").format("YYYYMMDD"));
      setValue("to_date", dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD"));
    }
    trigger()
    const params = getValues();
    // log("params", params)
    dispatch({ searchParams: params});
  }

  const onSearch = () => {
    const params = getValues();
    // log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true});
  };

  const onReset = () => {
    dispatch({ searchParams: null});
    resetComponent(0);
  }
  
  const onChange = (e: any) => {
    const value = parseInt(e.target.value, 10);
    setValue(e.target.name, value)
     
    resetComponent(value);
  }


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="flex pt-10 space-y-1">
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
              <Radio id ="search_gubn" name="search_gubn" value="0" label="doc_close_dd" onChange={onChange} defaultChecked/>
              <Radio id ="search_gubn" name="search_gubn" value="1" label="create_date" onChange={onChange} />
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
              id="no"
              label="mwb_hwb_bk"
              value={searchParams?.no}
              options={{ textAlign: "center", inline: true, noLabel: false }}
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
              options={{
                keyCol: "create_user",
                displayCol: ["create_user_nm"],
                inline: true,
                // defaultValue: getValues("create_user"),
                defaultValue: searchParams?.create_user
              }}
            />
            <ReactSelect
              id="state"
              label="state"
              dataSrc={status as data}
              width="w-96"
              lwidth="w-20"
              options={{
                keyCol: "state",
                displayCol: ["state", "state_nm"],
                inline: true,
                defaultValue: searchParams?.state,
              }}
            />
          </div>
        </PageSearchButton>
        </div>
       </form>
     </FormProvider>
  );
};

export default SearchForm;
