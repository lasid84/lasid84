'use client'


import React, { useCallback, useState, useEffect, Dispatch, useContext, memo, MouseEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { PageBKTabContent } from "layouts/search-form/page-search-row";
import { MaskedInputField } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import SubMenuTab, { tab } from "components/tab/tab"
import { SP_CreateData, SP_GetReportData, SP_UpdateData } from './data'; //SP_UpdateData
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData, rowAdd, ROW_TYPE, ROW_TYPE_NEW, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton, DropButton } from 'components/button';
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
import { toastSuccess } from "@/components/toast";
import dayjs from "dayjs";

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
  
  const { dispatch, objState } = useAppContext();
  const { MselectedTab } = objState;
  const [ref, setRef] = useState(objState.gridRef_m);
  const [ reportType, setReportType ] = useState<string>('');
  const { Create } = useUpdateData2(SP_CreateData, SEARCH_D);
  const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');

  const [reporttype, setReporttype] = useState<any>();

  useEffect(() => {
    setRef(objState.gridRef_m);
  }, [objState?.gridRef_m])

  useEffect(() => {
  }, [bkData])

  useEffect(() => {
    if (loadItem?.length) {
      setReporttype(loadItem[21]);
    }
  }, [loadItem?.length]);


  const { getValues } = useFormContext();

  const onRefresh = () => { dispatch({ isMDSearch: true }) }

  const onSearch = () => {}

  const onSave = (param: MouseEventHandler) => {
    let curData = getValues(); 
    let hasData = false;
    log("onSave", bkData, curData);
    if (bkData && bkData[ROW_TYPE] === ROW_TYPE_NEW) {

      let newData = {...bkData, ...curData};
      hasData = true;
      Create.mutate(newData, {
        onSuccess: (res: any) => {
          let bk_id = res.data[0].bk_id;
          let updatedTab = objState.tab1.map((tab:any) => {
            if (tab.cd === MselectedTab) {
              tab.cd = bk_id;
              tab.cd_nm = bk_id;

              return tab;
            } else return tab;
          });
          dispatch({ [MselectedTab]:null, [bk_id]: res.data[0], tab1: updatedTab, MselectedTab: bk_id, isMSearch:true })

          // objState.tab1.push({ cd: bk_id, cd_nm: bk_id }) //발급된 bk_id로 tab update
          // var filtered = objState.tab1.filter((element: any) => { return element.cd != 'NEW' })
          // dispatch({ popType: crudType.UPDATE, mSelectedRow: res.data[0], tab1: filtered, MselectedTab: res.data[0].bk_id, })
        },
      })
    } else {
      if (Object.entries(bkData).some(([key,val]):any => curData[key] && curData[key] != val)) {
        hasData = true;
        let updateData = {...bkData, ...curData};
        Update.mutate(updateData);
      }
    }

    if (hasData) {
      toastSuccess('Success.');
    }
  }
  
  const onBKCopy = () => {
    //await BKCopy(objState, bkData)
    var temp = objState.tab1
    .filter((v:{cd:string}) => v.cd.includes("NEW"))
    .sort()
    .reverse();    

    var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
    var tabName = `NEW${tabSeq}`;
    // setTimeout(() => {                
      objState.tab1.push({ cd: tabName, cd_nm: tabName })      
      dispatch({ [tabName] : {...bkData, 
        bk_id:'', 
        bk_dd: dayjs().format('YYYYMMDD'),
        trans_mode: objState.trans_mode,
        trans_type: objState.trans_type,
        doc_close_dd: dayjs().format('YYYYMMDD'),
        use_yn: 'Y',
        state : 0,
        [ROW_CHANGED] : true,
        [ROW_TYPE] : ROW_TYPE_NEW
      }, MselectedTab: tabName });
  // }, 200);
  }

  const onDropButtonClick = async (e: any) => {
    GetReportData.mutateAsync({type: e, bk_id:bkData.bk_id}, {
      onSuccess: (res: any) => {
        let report_data = res.data[0];
        log("onDropButtonClick", report_data);
      }
    }
  )};

  return (
    <div className="sticky top-0 z-20 flex w-full pt-10 space-y-1 bg-white">
        <PageBKTabContent
          right={
            <>
              <div className={"flex col-span-2 "}>
                <DropButton id={"download"} width="w-24" dataSrc={reporttype as data} options={{ keyCol :"report_type_nm" }} onClick={onDropButtonClick} />
                <Button id={"save"} onClick={onSave} width="w-24" />
              </div>                
              <div className={"flex col-span-2"}>
                <div className ={"flex space-x-1 px-1 mx-1 border rounded-full"}>
                  <RadioGroup label=''>
                      <Radio id ="search_gubn" name="download" value="0" label="excel"  defaultChecked/>
                      <Radio id ="search_gubn" name="download" value="1" label="pdf"  />
                  </RadioGroup>
                </div>
                <ICONButton id="clipboard" disabled={false} onClick={onRefresh} size={'24'} />
                  <ICONButton id="bkcopy" disabled={false} onClick={onBKCopy} size={'24'}  />
                  <ICONButton id="refresh" disabled={false} onClick={onRefresh} size={'24'} />
              </div>
            </>
          }
          bottom={<SubMenuTab loadItem={loadItem} onClickTab={onClickTab} />}
          //addition={<div className="w-2/12"></div>}
        >
          <div className={"flex-col col-span-2"}>
          <MaskedInputField id="bk_id" lwidth='w-24' width="w-40" height='h-8' value={bkData?.bk_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="vocc_id" lwidth='w-24' width="w-40" height='h-8' value={bkData?.vocc_id} options={{ isReadOnly: true, inline: true, textAlign : 'center'}} />
          </div>
          <div className={"flex-col col-span-2"}>
          <MaskedInputField id="waybill_no" lwidth='w-24' width="w-40" height='h-8' value={bkData?.waybill_no} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="mwb_no" lwidth='w-24' width="w-40" height='h-8' value={bkData?.mwb_no} options={{ isReadOnly: true, inline: true, textAlign : 'center'}} />
          </div>
          <div className={"flex-col col-span-2"}>
          <MaskedInputField id="create_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
          <MaskedInputField id="update_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.update_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date' }} />
          </div>
          <div className={"flex-col col-span-2"}>
          <MaskedInputField id="create_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date'  }} />
          <MaskedInputField id="update_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.update_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date' }} />
          </div>
        </PageBKTabContent>
    </div>
  );
});


export default BKMainTab