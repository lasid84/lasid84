'use client'


import React, { useCallback, useState, useEffect, Dispatch, useContext, memo } from "react";
import { FormProvider, SubmitHandler, useForm, useFormContext } from "react-hook-form";
import { PageBKTabContent } from "layouts/search-form/page-search-row";
import { MaskedInputField, Input } from 'components/input';
import { useGetData } from "components/react-query/useMyQuery";
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import SubMenuTab, { tab } from "components/tab/tab"
import {  SP_SaveTemplateCargoData, SP_SaveTemplateCostData, SP_UpdateTemplateData } from './data';
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData, ROW_CHANGED, ROW_TYPE, ROW_TYPE_NEW } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton } from 'components/button';
import { toastSuccess } from "@/components/toast";
import { Cargo } from "../../ocen1000/_component/cargoDetail";
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
  const { Update:SaveTemplateData } = useUpdateData2(SP_UpdateTemplateData);
  const { Update:SaveTemplateCargData } = useUpdateData2(SP_SaveTemplateCargoData);
  const { Update:SaveTemplateCostData } = useUpdateData2(SP_SaveTemplateCostData);

  const { dispatch, objState } = useAppContext();
  const { MselectedTab, popType, gridRef_cost } = objState;

  const { getValues } = useFormContext();

  const onSearch = () => {
    dispatch({isMDSearch:true})
  }
  const onRefresh = () => { dispatch({ isMDSearch: true }) }

  const saveMain = async () => {
    const curData = getValues(); 
      let hasBkData = false
      if (Object.entries(bkData).some(([key,val]):any => curData[key] && curData[key] != val)) {
        hasBkData = true;
        let updateData = {...bkData, ...curData};
        await SaveTemplateData.mutateAsync(updateData);
      }

    return hasBkData;
  }

  const saveCargo = async () => {
    var hasData = false;
    const cargo: any[] = [];
    if (bkData?.cargo) {
      bkData.cargo.forEach( async (data: Cargo) => {
        if (data[ROW_CHANGED]) {
          hasData = true;
          cargo.push({...data, template_id:bkData.template_id });
        }
      });

      if (hasData) await SaveTemplateCargData.mutateAsync({jsonData: JSON.stringify(cargo)});
    }

    return hasData;
  }

  const saveCost = async () => {
    const cost: any[] = [];
    let hasData = false;      
    
    const allColumns = gridRef_cost?.current?.api.getAllGridColumns();    
    const checkboxColumns = allColumns.filter((col:any) => col.getColDef().cellDataType === 'boolean')
                                      .map((col: { colId: any; }) => col.colId);

    gridRef_cost.current.api.forEachNode((node: any) => {
      if (node.data[ROW_CHANGED]) {
        hasData = true;
        var data = {
          ...node.data,
          template_id: bkData.template_id
        };
        checkboxColumns.forEach((col:string) => (data[col] = data[col] ? 'Y' : 'N'));
        // log("data", data)
        cost.push(data);
      }
    });
    
    if (hasData) await SaveTemplateCostData.mutateAsync({jsonData : JSON.stringify(cost)});
    return hasData;
  }

  const onSave = async (param:any) => {
    const hasBKData = await saveMain();
    const hasCargoData = await saveCargo();
    const hasCostData = await saveCost();

      if (hasBKData || hasCostData || hasCargoData) {
        onRefresh();
        toastSuccess('Success.');
      }
  };

  return (
    <div className="sticky top-0 z-20 flex w-full pt-10 space-y-1 bg-white">
        <PageBKTabContent
          right={
            <>
              <div className={"flex col-span-2 "}>
                <Button id={"save"} onClick={onSave} width="w-24" />
              </div>                
              <div className={"flex col-span-2"}>
                <ICONButton id="refresh" disabled={false} onClick={onSearch} size={'24'} />
              </div>
            </>
          }
          bottom={<SubMenuTab loadItem={loadItem} onClickTab={onClickTab} />}
          // addition={<div className="w-4/12"><></></div>}
        >
          <div className={"flex-col col-span-2"}>
            <MaskedInputField id="template_id" lwidth='w-24' width="w-40" height='h-8' value={bkData?.template_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="template_nm" lwidth='w-24' width="w-40" height='h-8' value={bkData?.template_nm} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          </div>
          <div className={"flex-col col-span-2"}>
            <MaskedInputField id="create_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="create_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date' }} />
          </div>
          <div className={"flex-col col-span-2"}>
            <MaskedInputField id="update_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.update_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
            <MaskedInputField id="update_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.update_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date' }} />
          </div>
          

        </PageBKTabContent>
      </div>
  );
});


export default BKMainTab