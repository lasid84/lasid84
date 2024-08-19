'use client'


import React, { useCallback, useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { PageBKTabContent } from "layouts/search-form/page-search-row";
import { useUserSettings } from "states/useUserSettings";
import { shallow } from "zustand/shallow";
import { MaskedInputField, Input } from 'components/input';
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import SubMenuTab, { tab } from "components/tab/tab"
import { SP_CreateData, SP_UpdateData } from './data';
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData, ROW_CHANGED, ROW_TYPE, ROW_TYPE_NEW } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton } from 'components/button';
import { Badge } from "@/components/badge";
import Stepper from "components/stepper/index";
import { toastSuccess } from "@/components/toast";
import {onGridNew1} from "./gridMaster"
const { log } = require("@repo/kwe-lib/components/logHelper");

export interface returnData {
  cursorData: []
  numericData: number;
  textData: string;
}

export interface typeloadItem {
  data: {} | undefined
}

const BKMainTab = memo(({ loadItem, bkData, onClickTab }: any) => {
  const { Create } = useUpdateData2(SP_CreateData, SEARCH_D);
  const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);

  const { dispatch, objState } = useAppContext();
  const { MselectedTab, popType } = objState;

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

  const onBKCopy = () => {
    onGridNew1(objState, bkData)
  }

  const handleMaskedInputChange = (e: any) => {
    e.preventDefault();
    const id = e.target.id;
    const val = getValues(id);
    // dispatch({ bkData: { ...bkData, [id]: val } })
    dispatch({[MselectedTab]: {...bkData, [id]:val, [ROW_CHANGED]: true}})
  }


  const onFormSubmit: SubmitHandler<any> = useCallback((param) => {
    //템플릿 저장, crudType체크하여 UPDATE / CREATE 
    if (bkData[ROW_CHANGED]) { 
      var hasData = true;
      log('===== bkData[ROW_TYPE]', bkData)
      if (bkData[ROW_TYPE] === ROW_TYPE_NEW) { 
        Create.mutate(bkData, {
          onSuccess: (res: any) => {
            let template_id = res.data[0].template_id;
            let template_nm = res.data[0].template_nm;
            let updatedTab = objState.tab1.map((tab:any) => {
              if (tab.cd === MselectedTab) {
                tab.cd = template_id;
                tab.cd_nm = template_nm;

                return tab;
              } else return tab;
            });
            dispatch({ [MselectedTab]:null, [template_id]: res.data[0], tab1: updatedTab, MselectedTab: template_nm, })

            // objState.tab1.push({ cd: bk_id, cd_nm: bk_id }) //발급된 bk_id로 tab update
            // var filtered = objState.tab1.filter((element: any) => { return element.cd != 'NEW' })
            // dispatch({ popType: crudType.UPDATE, mSelectedRow: res.data[0], tab1: filtered, MselectedTab: res.data[0].bk_id, })
          },
        })
      } else {
        Update.mutate(bkData);
        let updatedTab = objState.tab1.map((tab:any) => {
          if (tab.cd === MselectedTab) {
            tab.cd = bkData.template_id
            tab.cd_nm = bkData.template_nm
            return tab;
          } else return tab;
        });
        dispatch({ tab1 : updatedTab , MselectedTab : bkData.template_id })
      }

      if (hasData) {
        toastSuccess('Success.');
      }
    }
  }, [bkData]);

  return (
    <div className="sticky top-0 z-20 w-full pt-10 space-y-1 bg-white">
      <FormProvider {...methods}>
        <form /*onSubmit={handleSubmit(onSearch)}*/ className="w-full space-y-1">
          <PageBKTabContent
            right={
              <>
                <div className={"flex col-span-2 "}>
                  <Button id={"save"} onClick={handleSubmit(onFormSubmit)} width="w-24" />
                </div>                
                <div className={"flex col-span-2"}>
                  <ICONButton id="bkcopy" disabled={false}  onClick={onBKCopy} size={'24'} />
                  <ICONButton id="refresh" disabled={false} onClick={onSearch} size={'24'} />
                </div>
              </>
            }
            bottom={<SubMenuTab loadItem={loadItem} onClickTab={onClickTab} />}
            addition={<div className="w-4/12"><></></div>}
          >
            <div className={"flex col-span-3"}>
            <MaskedInputField id="template_id" lwidth='w-24' width="w-40" height='h-8' value={bkData?.template_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="create_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="create_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date' }} />
            </div>
            <div className={"flex col-span-3"}>
            <MaskedInputField id="template_nm" lwidth='w-24' width="w-40" height='h-8' value={bkData?.template_nm} options={{ isReadOnly: false, inline: true, textAlign: 'center', }} events={{ onChange: handleMaskedInputChange }}/>
            <MaskedInputField id="update_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.update_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="update_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.update_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date' }} />
            </div>

          </PageBKTabContent>
        </form>
      </FormProvider>
    </div>
  );
});


export default BKMainTab