'use client'


import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { useAppContext } from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";
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
  mainData : typeloadItem;
};

const WBMain = memo(({ loadItem, mainData }: any) => {

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


  //const { data: mainData } = useGetData({ wb_no: objState?.MselectedTab }, SEARCH_MD, SP_GetMasterData, { enabled: true });

  useEffect(() => {
    if (loadItem?.length) {
      // log("=================", loadItem[0].data, loadItem[1].data)

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
    if (mainData) {
      setData((mainData?.[0] as gridData).data[0]);
    }
  }, [mainData]) 


  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
        <PageContent
          right={
            <>
              <Button id="icon" disabled={false} onClick={onSearch} />
              <Button id="icon" disabled={false} onClick={onSearch} />
              <Button id="icon" disabled={false} onClick={onSearch} />
            </>
          }
        >
          <div className='col-span-2'><MaskedInputField id="waybill_no" lwidth='w-30' height='h-8' value={data?.waybill_no} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /></div>
          <MaskedInputField id="job_no" lwidth='w-16' width="w-24" height='h-8' value={data?.bol_type} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="pipeline_tx_id" lwidth='w-12' width="w-24" height='h-8' value={data?.pipeline_tx_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="trans_mode" lwidth='w-12' width="w-24" height='h-8' value={data?.trans_mode} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="trans_type" lwidth='w-12' width="w-24" height='h-8' value={data?.trans_type} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="orig_terminal_id" lwidth='w-12' width="w-24" height='h-8' value={data?.orig_terminal_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="orig_department_id" lwidth='w-12' width="w-24" height='h-8' value={data?.orig_department_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <div className='col-span-2'><MaskedInputField id="shipper_name" label="controlling_party" lwidth="w-30" height='h-8' value={data?.shipper_name} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /></div>
          {/* <MaskedInputField id="dest_city_code" lwidth='w-12' width="w-24" height='h-8' value={data?.dest_city_code} options={{ isReadOnly: true, inline: true, textAlign: 'center',  }} />           */}
        </PageContent>



      </form>
    </FormProvider>
  );
});


export default WBMain