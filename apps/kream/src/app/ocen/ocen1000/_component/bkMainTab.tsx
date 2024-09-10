'use client'


import React, { useCallback, useState, useEffect, Dispatch, useContext, memo, MouseEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { PageBKTabContent } from "layouts/search-form/page-search-row";
import { MaskedInputField } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import SubMenuTab, { tab } from "components/tab/tab"
import { SP_CreateData, SP_GetReportData, SP_InsertCargo, SP_UpdateCargo, SP_UpdateData, SP_DownloadReport } from './data'; //SP_UpdateData
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData, rowAdd, ROW_TYPE, ROW_TYPE_NEW, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton, DropButton } from 'components/button';
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
import { toastSuccess } from "@/components/toast";
import dayjs from "dayjs";
import { Cargo } from "./cargoDetail";

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
  const { Create: CreateBKData } = useUpdateData2(SP_CreateData);
  const { Update: UpdateBKData } = useUpdateData2(SP_UpdateData);
  const { Create: CreateCargo } = useUpdateData2(SP_InsertCargo);
  const { Update: UpdateCargo } = useUpdateData2(SP_UpdateCargo);

  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');
  const { Create : Download } = useUpdateData2(SP_DownloadReport, "Download");

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

  const onRefresh = () => { dispatch({ isRefresh : true, isMDSearch: true }) }

  const onSearch = () => {}

  const SaveBkData = async () => {
    let curData = getValues(); 
    let hasData = false;
    log("SaveBkData", bkData)
    
    
    if (bkData && bkData[ROW_TYPE] === ROW_TYPE_NEW) {  
      hasData = true;  
      let newData = {...bkData, ...curData};
      CreateBKData.mutate(newData, {
        onSuccess: (res: any) => {
          let bk_id = res.data[0].bk_id;
          let updatedTab = objState.tab1.map((tab:any) => {
            if (tab.cd === MselectedTab) {
              tab.cd = bk_id;
              tab.cd_nm = bk_id;

              return tab;
            } else return tab;
          });
          dispatch({ [MselectedTab]:null, /*[bk_id]: res.data[0],*/ tab1: updatedTab, MselectedTab: bk_id })
        },
      })
    } else {
      log("UpdateBKData", Object.entries(bkData).some(([key,val]):any => curData[key] && curData[key] != val), bkData[ROW_CHANGED], curData, bkData)
      if (Object.entries(bkData).some(([key,val]):any => curData[key] && curData[key] != val) || bkData[ROW_CHANGED]) {
        hasData = true;
        let updateData = {...bkData, ...curData};
        UpdateBKData.mutate(updateData);
      }
    }
    

    return hasData;
  }

  const SaveCargo = async () => {
    var hasData = false;
    if (bkData?.cargo) {
      bkData.cargo.forEach( async (data: Cargo) => {
        if (data[ROW_CHANGED]) {
          hasData = true;
          try{
            if (data[ROW_TYPE] === ROW_TYPE_NEW) {
              await CreateCargo.mutateAsync(data);
            } else {          //수정
              await UpdateCargo.mutateAsync(data);
            }   
          }catch(error){
            log("error:", error);
          }finally{
            data[ROW_CHANGED] = false;
          }            
        }
      })        
    }

    return hasData;
  }

  const onSave = async (param: MouseEventHandler) => {
    let hasBKData = false;
    let hasCargoData = false;
    
    hasCargoData = await SaveCargo();
    hasBKData = await SaveBkData();

    if (hasBKData || hasCargoData) {
      onRefresh();
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
    const curData = getValues();

    if (e === null || e === undefined) return;
    GetReportData.mutateAsync({type: e, bk_id:bkData.bk_id}, {
      onSuccess: (res: any) => {

        let pageDivide;
        let voccID : any;

        if (res[0] !== undefined) {

          let reportData : any = new Object;

          /**
           * @Dev
           * Separate excel cell value from file name, page divide.
           */
          for (let [key, value] of Object.entries(res[0].data[0])) {
            if (value === null || value === undefined) {
              value = ""
            }

            switch(key) {
              case "page_divide":
                pageDivide = value;
                break;
              case "vocc_id":
                voccID = value;
                break;
              default:
                reportData[key.toUpperCase()] = value;
            }
          }


          const templateType = Number(e);
          const fileExtension : Number = Number(curData.search_gubn) || 0;

          const fileName = loadItem[21].data[templateType].report_type_nm.concat("_", voccID);

          const downloadData = {
              "reportData" : reportData, 
              "fileExtension" : fileExtension, 
              "templateType" : templateType, 
              "fileName" : fileName, 
              "pageDivide" : pageDivide
          };

          Download.mutateAsync(downloadData, {
            onSuccess: async (res: any) => {
              if (res.data !== undefined || "") {
                const file = window.URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }));

                let extension;
                if (!fileExtension) {
                  extension = '.xlsx';
                } else {
                  extension = '.pdf';
                }

                downloadBlobFile(file, fileName.concat(extension));
              }
            }
          });
        }
      }
    }
  )};

  function downloadBlobFile(file : string, fileName : string) {
    const tempElement = document.createElement('a');
    tempElement.href = file;
    tempElement.setAttribute("download", fileName);
    document.body.appendChild(tempElement);
    tempElement.click();
    document.body.removeChild(tempElement);
    window.URL.revokeObjectURL(file);
  }

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
                      <Radio id ="search_gubn" name="download" value="0" label="excel" defaultChecked/>
                      <Radio id ="search_gubn" name="download" value="1" label="pdf" />
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