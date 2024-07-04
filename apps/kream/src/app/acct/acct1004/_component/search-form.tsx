'use client'

import { useTranslation } from "react-i18next";
import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { ErrorMessage } from "components/react-hook-form/error-message";
import PageSearch, {PageSearchButton} from "layouts/search-form/page-search-row";
import { TSelect2, TCancelButton, TSubmitButton, TButtonBlue } from "components/form";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import { DateInput, DatePicker } from 'components/date'
import dayjs from 'dayjs'
import CustomSelect from "components/select/customSelect";
import { Button } from 'components/button';
import { gridData } from "@/components/grid/ag-grid-enterprise";


// import { useGetData } from './test'
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}


type Props = {
  onSubmit: SubmitHandler<any>;
  loadItem: typeloadItem;
};

const SearchForm = memo(({ loadItem }: any) => {
  // const { loadItem } = props;

  // log("search-form 시작", Date.now());
  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  const methods = useForm({
    defaultValues: {
      trans_mode: gTransMode || 'ALL',
      trans_type: gTransType || 'ALL',
      fr_date: dayjs().subtract(1, 'month').startOf('month').format("YYYYMMDD"),
      to_date: dayjs().subtract(1, 'month').endOf('month').format("YYYYMMDD"),
      no: '',
      cust_code: ''
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

  // //Set select box data
  const [transmode, setTransmode] = useState<any>();
  const [transtype, setTranstype] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem?.length) {
      // log("=================", loadItem[0].data, loadItem[1].data)
      setTransmode(loadItem[0])
      setTranstype(loadItem[1])
      setCustcode(loadItem[8])

      onSearch();
      // onSubmit();
      // handleSubmit(onSubmit)();
    }
  }, [loadItem?.length])

  const onSearch = () => {
    // log("onSearch")
    const params = getValues();
    log("onSearch", params);
    dispatch({ searchParams: params, isMSearch: true });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageSearchButton
          right={
            <>
              <div className={"col-span-1"}>
              <Button id="search" disabled={false} onClick={onSearch}/>
              </div>
            </>
          }>
          <div className={"col-span-1"}>
            <ReactSelect
              id="trans_mode" label="trans_mode" dataSrc={transmode as data}
              width='w-96' lwidth='w-20' height="8px"
              options={{
                keyCol: "trans_mode",
                displayCol: ['name'],
                inline: true,
                defaultValue: getValues('trans_mode')
              }}
            />

            <ReactSelect
              id="trans_type" label="trans_type" dataSrc={transtype as data}
              width='w-96' lwidth='w-20' height="8px"
              options={{
                keyCol: "trans_type",
                displayCol: ['name'],
                inline: true,
                defaultValue: getValues('trans_type')
              }}
            />
          </div>
          {/* <ReactSelect
            id="cust_code" label="cust_code" dataSrc={custcode as data}
            options={{
              keyCol: "cust_code",
              displayCol: ['cust_nm'],
              inline: true,
              defaultValue: getValues('cust_code')
            }}
          /> */}
          <div className={"col-span-1"}>
            <DatePicker id="fr_date" value={objState.searchParams?.fr_date} options={{ inline: true, textAlign: 'center', freeStyles: "p-1 underline border-1 border-slate-300" }}  lwidth='w-20' height="h-8" />
            <DatePicker id="to_date" value={objState.searchParams?.to_date} options={{ inline: true, textAlign: 'center', freeStyles: "underline border-1 border-slate-300" }} lwidth='w-20' height="h-8" />
          </div>
          <div className={"col-span-2"}>
            <CustomSelect
              id="cust_code"
              // label="trans_mode"
              initText="Select a Customer"
              listItem={custcode as gridData}
              valueCol={["cust_code", "cust_nm"]}
              displayCol="cust_nm"
              gridOption={{
                colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
                dataType: { "bz_reg_no": "bizno" }
              }}
              gridStyle={{ width: '600px', height: '300px' }}
              style={{ width: '1000px', height: "8px" }}
              isDisplay={true}
            />
            <MaskedInputField id="no" value={objState.searchParams?.no} label="bl/inv no." options={{ textAlign: 'center', inline: true, noLabel: false }} height='h-8' />
          </div>
        </PageSearchButton>
      </form>
    </FormProvider>
  );
});


export default SearchForm