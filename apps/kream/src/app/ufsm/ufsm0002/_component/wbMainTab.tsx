'use client'


import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageTabContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import {useAppContext } from "components/provider/contextObjectProvider";
import SubMenuTab, { tab } from "components/tab/tab"
import { SP_CreateIFData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton } from 'components/button';
import { Badge } from "@/components/badge";

const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}

const WBMain = memo(({ loadItem, mainData, onClickTab }: any) => {
  const { Create } = useUpdateData2(SP_CreateIFData);
  const { dispatch, objState } = useAppContext();
  const [groupcd, setGroupcd] = useState<any>([])
  const [data, setData] = useState<any>();
  const IN_PGM_CODE = '1'
  
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
    // const params = getValues();
    // log("onSearch", params);
  }
  const onRefresh = () => { dispatch({ isMDSearch: true }) }
  const onInterface = () => {
    const params = getValues();
    Create.mutate(params)
  }
  useEffect(() => {
    if (mainData)
      setData((mainData?.[0] as gridData).data[0]);
  }, [mainData])

  return (
    <div className="sticky top-0 z-20 w-full pt-10 space-y-1 bg-white">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
          <PageTabContent
            right={
              <>
                <div className={"flex col-span-2 "}>
                  <Badge size={"md"} name={data?.status} color="border-sky-500 text-sky-500" rounded outlined />
                </div>
                <div className={"flex col-span-2"}>
                  <ICONButton id="interface" disabled={false} onClick={onInterface} size={'24'} />
                  <ICONButton id="refresh" disabled={false} onClick={onRefresh} size={'24'} />
                  <ICONButton id="reset" disabled={false} onClick={onSearch} size={'24'} />
                </div>
              </>
            }
            bottom={<SubMenuTab loadItem={loadItem} onClickTab={onClickTab} />}
          >
            <MaskedInputField id="mwb_no" lwidth='w-24' width="w-36" height='h-8' value={data?.mwb_no} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="orig_terminal_id" lwidth='w-12' width="w-16" height='h-8' value={data?.orig_terminal_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="trans_mode" lwidth='w-12' width="w-24" height='h-8' value={data?.trans_mode} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="trans_type" lwidth='w-12' width="w-24" height='h-8' value={data?.trans_type} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="pipeline_tx_id" lwidth='w-18' width="w-32" height='h-8' value={data?.pipeline_tx_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            {/* <MaskedInputField id="job_no" lwidth='w-16' width="w-24" height='h-8' value={data?.bol_type} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /> */}
            <div className='col-span-2'>
              <MaskedInputField id="last_interfaced" lwidth='w-24' width="w-44" height='h-8' value={data?.last_interfaced} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'time', fontSize: "xs" }} />
            </div>
            <MaskedInputField id="orig_department_id" lwidth='w-12' width="w-24" height='h-8' value={data?.orig_department_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <div className='col-span-2'><MaskedInputField id="shipper_name" label="controlling_party" lwidth="w-25" height='h-8' value={data?.shipper_name} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /></div>
            {/* <MaskedInputField id="dest_city_code" lwidth='w-12' width="w-24" height='h-8' value={data?.dest_city_code} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />           */}
            <MaskedInputField id="in_pgm_code" value={IN_PGM_CODE} options={{ freeStyles: 'hidden', noLabel: true }} />
          </PageTabContent>
        </form>
      </FormProvider>
    </div>
  );
});


export default WBMain