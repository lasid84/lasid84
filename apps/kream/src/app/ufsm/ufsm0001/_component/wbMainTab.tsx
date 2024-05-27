'use client'


import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageTabContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { useAppContext } from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton } from 'components/button';
import { Badge } from "@/components/badge";
import SubMenuTab, { tab, WBMenuTab } from "components/tab/tab"
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
  mainData: typeloadItem;
};

const WBMain = memo(({ loadItem, mainData, onClickTab }: any) => {

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


  const onSearch = () => {
    const params = getValues();
    log("onSearchwb_maintab", params);
    //dispatch({ searchParams: params, isMSearch: true });
  }

  useEffect(() => {
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);
    }
  }, [mainData])

  // const handleOnClickTab = (code: any) => { dis }

  return (
    //  <div className="absolute">
    <div className="sticky top-0 z-20 w-full pt-10 space-y-1">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
          <PageTabContent
            right={
              <>
                <div className={"col-span-2"}>
                  <Badge size={"md"} name={data?.status} color="border-sky-500 text-sky-500 rounded outlined" />
                  <ICONButton id="refresh" disabled={false} onClick={onSearch} size={'24'} />
                </div>
                <div className={"col-span-1"}>
                  <ICONButton id="download" disabled={false} onClick={onSearch} size={'24'} />
                </div>
                <div className={"col-span-1"}>
                  <ICONButton id="reset" disabled={false} onClick={onSearch} size={'24'} />
                </div>
              </>
            }
            bottom={<SubMenuTab loadItem={loadItem} onClickTab={onClickTab} />}
          >
            <div className='col-span-2'><MaskedInputField id="waybill_no" lwidth='w-24' width="w-40" height='h-8' value={data?.waybill_no} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /></div>
            <MaskedInputField id="pipeline_tx_id" lwidth='w-12' width="w-32" height='h-8' value={data?.pipeline_tx_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="trans_mode" lwidth='w-12' width="w-24" height='h-8' value={data?.trans_mode} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="trans_type" lwidth='w-12' width="w-24" height='h-8' value={data?.trans_type} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="last_interfaced" lwidth='w-20' width="w-44" height='h-8' value={data?.last_interfaced} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'time' }} />
            <MaskedInputField id="orig_terminal_id" lwidth='w-12' width="w-24" height='h-8' value={data?.orig_terminal_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="orig_department_id" lwidth='w-12' width="w-24" height='h-8' value={data?.orig_department_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <div className='col-span-2'><MaskedInputField id="shipper_name" label="controlling_party" lwidth="w-25" height='h-8' value={data?.shipper_name} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /></div>
            {/* <MaskedInputField id="dest_city_code" lwidth='w-12' width="w-24" height='h-8' value={data?.dest_city_code} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />           */}
          </PageTabContent>
        </form>
      </FormProvider>
    </div>
  );
});


export default WBMain