'use client'


import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import SubMenuTab, { tab } from "components/tab/tab"
import { DateInput, DatePicker } from 'components/date'
import dayjs from 'dayjs'
import { gridData } from "components/grid/ag-grid-enterprise";
import { SP_GetMasterData } from "./data";
import { Button } from 'components/button';

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

const WBMain = memo(({ loadItem }: any) => {

  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])
  const [data, setData] = useState<any>();

  // //사용자 정보
  const gTransMode = useUserSettings((state) => state.data.trans_mode, shallow)
  const gTransType = useUserSettings((state) => state.data.trans_type, shallow)

  const methods = useForm({
    defaultValues: {
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

  const { data: mainData } = useGetData({ wb_no: objState?.MselectedTab }, SEARCH_MD, SP_GetMasterData, { enabled: true });

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

  useEffect(() => {
    log("maindataaaaaaa", mainData);
    if (mainData) setData((mainData as gridData)?.data[0]);
  }, [mainData])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageContent
          right={
            <>
              <Button id="icon" disabled={false} onClick={onSearch}/>
              <Button id="icon" disabled={false} onClick={onSearch}/>
              <Button id="icon" disabled={false} onClick={onSearch}/>              
            </>
          }
        >
          <div className='col-span-2'><MaskedInputField id="waybill_no" lwidth='w-30' height='h-6' value={data?.waybill_type} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} /></div>
          <MaskedInputField id="job_no" lwidth='w-16' width="w-24" height='h-6' value={data?.bol_type} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />
          <MaskedInputField id="pipline_no" lwidth='w-12' width="w-24" height='h-6' value={data?.service_type_code} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />
          <MaskedInputField id="mode" lwidth='w-12' width="w-24" height='h-6' value={data?.carrier_code} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />
          <MaskedInputField id="company" lwidth='w-12' width="w-24" height='h-6' value={data?.freight_ppc_ind} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />
          <MaskedInputField id="terminal" lwidth='w-12' width="w-24" height='h-6' value={data?.other_ppc_ind} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />
          <MaskedInputField id="department" lwidth='w-12' width="w-24" height='h-6' value={data?.booking_no} options={{ isReadOnly: true , inline: true, textAlign: 'center', }} />
          <MaskedInputField id="controlling_party" lwidth='w-12' width="w-24" height='h-6' value={data?.origin_port} options={{ isReadOnly: true , inline: true, textAlign: 'center', }} />
          <MaskedInputField id="dest_city_code" lwidth='w-12' width="w-24" height='h-6'  value={data?.dest_city_code} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />          
        </PageContent>



      </form>
    </FormProvider>
  );
});


export default WBMain