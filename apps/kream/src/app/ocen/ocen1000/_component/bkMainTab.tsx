'use client'


import React, { useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageBKTabContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import SubMenuTab, { tab } from "components/tab/tab"
import { SP_CreateIFData } from './data';
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton } from 'components/button';
import { Badge } from "@/components/badge";

import Stepper from "components/stepper/index";
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}

const BKMainTab = memo(({ loadItem, mainData, onClickTab }: any) => {
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
    if (mainData){
        setData((mainData?.[0] as gridData).data[0]);
    }    
  }, [mainData])

  return (
    <div className="sticky top-0 z-20 w-full pt-10 space-y-1 bg-white">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSearch)} className="w-full space-y-1">
          <PageBKTabContent
            right={
              <>
                <div className={"flex col-span-2 "}>
                  <Badge size={"md"} name={data?.bk_id} color="border-sky-500 text-sky-500" rounded outlined />
                </div>
                <div className={"flex col-span-2"}>
                  <ICONButton id="interface" disabled={false} onClick={onInterface} size={'24'} />
                  <ICONButton id="refresh" disabled={false} onClick={onRefresh} size={'24'} />
                  <ICONButton id="reset" disabled={false} onClick={onSearch} size={'24'} />
                </div>
              </>
            }
            bottom={<SubMenuTab loadItem={loadItem} onClickTab={onClickTab} />}
            addition={<Stepper title={"tello"} ><></></Stepper>}
          >      
            <MaskedInputField id="bk_id" lwidth='w-24' width="w-40" height='h-8' value={data?.bk_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="create_user" lwidth='w-24' width="w-40" height='h-8' value={data?.create_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            {/* <MaskedInputField id="create_date" lwidth='w-24' width="w-36" height='h-8' value={data?.create_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} /> */}
             <MaskedInputField id="update_date" lwidth='w-24' width="w-40" height='h-8' value={data?.update_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'time' }} />
           </PageBKTabContent>
        </form>
      </FormProvider>
    </div>
  );
});


export default BKMainTab