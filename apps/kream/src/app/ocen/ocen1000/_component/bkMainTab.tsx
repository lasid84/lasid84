'use client'


import React, { useCallback, useState, useEffect, Dispatch, useContext, memo, MouseEventHandler } from "react";
import { useFormContext } from "react-hook-form";
import { PageBKTabContent } from "layouts/search-form/page-search-row";
import { MaskedInputField } from 'components/input';
import { SEARCH_MD, crudType, useAppContext } from "components/provider/contextObjectProvider";
import { ReactSelect, data } from "@/components/select/react-select2";
import SubMenuTab, { tab } from "components/tab/tab"
import { SP_CreateData, SP_GetReportData, SP_InsertCargo, SP_UpdateCargo, SP_UpdateData, SP_DownloadReport, SP_SaveCostData, SP_GetClipBoardData } from './data'; //SP_UpdateData
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { gridData, rowAdd, ROW_TYPE, ROW_TYPE_NEW, ROW_CHANGED } from "components/grid/ag-grid-enterprise";
import { Button, ICONButton, DropButton } from 'components/button';
import Radio from "components/radio/index"
import RadioGroup from "components/radio/RadioGroup"
import { toastSuccess } from "@/components/toast";
import dayjs from "dayjs";
import { Cargo } from "./cargoDetail";
import EmailSendPopup from "./popup/popEmailSendcomm"
import _ from 'lodash';
import { toastError } from 'components/toast';
import StepList, { Steps3, Steps2, Steps1 } from "@/components/stepper/steps";

import { log, error } from '@repo/kwe-lib-new';

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
  const { MselectedTab, gridRef_cost } = objState;
  const [ref, setRef] = useState(objState.gridRef_m);

  const [ reportType, setReportType ] = useState<string>('');
  const [ stateList, setStateList ] = useState<string>('');
  const { Create: CreateBKData } = useUpdateData2(SP_CreateData);
  const { Update: UpdateBKData } = useUpdateData2(SP_UpdateData);
  const { Create: CreateCargo } = useUpdateData2(SP_InsertCargo);
  const { Update: UpdateCargo } = useUpdateData2(SP_UpdateCargo);
  const { Update: SaveCostData } = useUpdateData2(SP_SaveCostData);

  const { Create: GetReportData } = useUpdateData2(SP_GetReportData, 'GetReportData');
  const { Create : Download } = useUpdateData2(SP_DownloadReport, "Download");
  const { data: clipboardData, refetch: clipboardRefetch, isLoading: isLoadingClipboard } = useGetData({bk_id : bkData?.bk_id}, "ClipBoardData", SP_GetClipBoardData, { enabled: false, staleTime: 0, cacheTime: 0 });

  const [reporttype, setReporttype] = useState<any>();
 
  useEffect(() => {
    setRef(objState.gridRef_m);
  }, [objState?.gridRef_m])

  useEffect(() => {
    if (bkData) {
      if (bkData.waybill_no) {
        bkData.state = '1';
      }

      if (bkData.has_ams === 'Y') {
        bkData.state = '4';
      }

      if (Number(bkData.state) >= 1 && bkData.invoice_cnt > 0) {
        bkData.state = '5';
      }
      
      // log("bkData.state : ", bkData.state, bkData.invoice_cnt);
      dispatch({ [MselectedTab]: bkData })      
    }
  }, [bkData])

  useEffect(() => {
    if (loadItem?.length) {
      setReporttype(loadItem[21]);
      setStateList(loadItem[2]);
    }
  }, [loadItem?.length]);

  useEffect(() => {
    if (objState.isSaveDetail) {
        dispatch({ isSaveDetail: false});
        onSave(null);
    }
}, [objState.isSaveDetail]);

  const { getValues } = useFormContext();

  const onRefresh = () => { dispatch({ isRefresh : true, isMDSearch: true}) }

  const onSearch = () => {}

  const SaveBkData = async () => {
    let curData = getValues(); 
    let hasData = false;    
    
    if (bkData && bkData[ROW_TYPE] === ROW_TYPE_NEW) {  
      hasData = true;  
      let newData = {...bkData, ...curData};
      // log("New SaveBkData", bkData, curData, newData);
      await CreateBKData.mutateAsync(newData, {
        onSuccess: (res: any) => {
          let bk_id = res.data[0].bk_id;
          bkData.bk_id = bk_id;
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
      if (Object.entries(bkData).some(([key,val]):any => curData[key] !== undefined && curData[key] != val) || bkData[ROW_CHANGED]) {
        hasData = true;
        let updateData = {...bkData, ...curData};
        await UpdateBKData.mutateAsync(updateData);
      }
    }
    
    return hasData;
  }

  const SaveCargo = () => {
    let hasData = false;
    log("SaveCargo", bkData?.cargo, MselectedTab);
    /* 카고 저장 */
    if (bkData?.cargo) {
      bkData.cargo.forEach( async (data: Cargo) => {
        if (data[ROW_CHANGED]) {
          hasData = true;
          var updatedData = {
            ...data,
            bk_id: bkData.bk_id
          };

          if (data[ROW_TYPE] === ROW_TYPE_NEW) {
            await CreateCargo.mutateAsync(updatedData);
          } else {          //수정
            await UpdateCargo.mutateAsync(updatedData);
          }            
        }
      })        
    }
    return hasData;
  }

  const SaveCost = async () => {
    let hasData = false;

    const cost: any[] = [];
    log("SaveCost", bkData?.cargo, MselectedTab);
    /* Cost 저장 */
    const allColumns = gridRef_cost?.current?.api.getAllGridColumns();   
    if (!allColumns) return;

    const checkboxColumns = allColumns.filter((col:any) => col.getColDef().cellDataType === 'boolean')
                                      .map((col: { colId: any; }) => col.colId);
    await gridRef_cost.current.api.forEachNode(async (node: any) => {
      if (node.data[ROW_CHANGED]) {
        hasData = true;
        var data = {
          ...node.data,
          bk_id: bkData.bk_id
        };
        await checkboxColumns.forEach((col:string) => (data[col] = data[col] === false ? 'N' : 'Y'));
        // log("data", data)
        cost.push(data);
      }
      
    });

    // log("cost", JSON.stringify(cost));
    await SaveCostData.mutateAsync({jsonData : JSON.stringify(cost)});
    return hasData;
  }

  const onSave = async (param: MouseEventHandler | null) => {    
    let hasMainData = await SaveBkData();
    let hasCargoData = await SaveCargo();
    let hasCostData = await SaveCost();

    if (hasMainData || hasCargoData || hasCostData) {      
      toastSuccess('Success.');
      setTimeout(() => onRefresh(), 200);
      // onRefresh();
    }
  };

  const onClipboard = async () => {
    const { data } = await clipboardRefetch();
    // log("clipboardData6", clipboardData, data);
    const htmlString = ((data as any)[0] as gridData)?.data[0].html;

    try {      
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlString], { type: 'text/html' }),
      });
      
      await navigator.clipboard.write([clipboardItem]);
      
      toastSuccess("클립보드에 복사 되었습니다.");
    } catch (err) {
      error('클립보드 복사 실패:', err);
    }
  }
  
  const onBKCopy = () => {
    // console.log("onBKCopy")
    // return;
    
    var temp = objState.tab1
    .filter((v:{cd:string}) => v.cd.includes("NEW"))
    .sort()
    .reverse();    

    var tabSeq = temp.length ? Number(temp[0].cd.replace("NEW",'')) + 1 : 1;
    var tabName = `NEW${tabSeq}`;
    // setTimeout(() => {               
      objState.tab1.push({ cd: tabName, cd_nm: tabName }); 
      const deepCopiedCargo = _.cloneDeep(bkData.cargo);
      const cargo = deepCopiedCargo.map((row:any) => {
        row[ROW_TYPE] = ROW_TYPE_NEW;
        row[ROW_CHANGED] = true;
        row.use_yn = 'Y';
        return row;
      });  

      const deepCopiedCost = _.cloneDeep(bkData.cost);
      const cost = {
        fields: deepCopiedCost.fields,
        data : deepCopiedCost.data.map((row:any) => {
          row.bk_id = bkData.bk_id;
          row.waybill_no = '';
          row.use_yn = 'Y';
          row[ROW_TYPE] = ROW_TYPE_NEW;
          row[ROW_CHANGED] = true;
          return row;
        })
      }

      var newBkData = _.cloneDeep(bkData);
      newBkData = {
        ...newBkData,
        bk_id:'',
        bk_dd: dayjs().format('YYYYMMDD'),
        doc_close_dd: dayjs().format('YYYYMMDD'),
        waybill_no: null,
        use_yn: 'Y',
        state : 0,
        cargo: cargo,
        cost: cost,
        [ROW_CHANGED] : true,
        [ROW_TYPE] : ROW_TYPE_NEW
      }
      
      // log("copy", newBkData, tabName);
      dispatch({ [tabName] : newBkData, MselectedTab: tabName});
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

          let reportDataList : string[] = [];
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
          // log("reportData", reportData);
          reportDataList.push(reportData);

          // const templateType = [Number(e), Number(e)];
          const templateTypeList : string[] = [loadItem[21].data[Number(e)].key]
          // const fileExtension : Number = Number(curData.search_gubn) || 0;

          const templateType = Number(e);
          const fileExtension : Number = Number(curData.search_gubn) || 0;

          // const fileName : string[] = [loadItem[21].data[templateType[0]].report_type_nm.concat("_", voccID), loadItem[21].data[templateType[0]].report_type_nm.concat("-", voccID)];
          const fileName = [loadItem[21].data[templateType].report_type_nm.concat("_", voccID)];

          const downloadData = {
              // "responseType" : 0,
              "reportDataList" : reportDataList, 
              "fileExtension" : fileExtension, 
              "templateTypeList" : templateTypeList, 
              "fileNameList" : fileName, 
              "pageDivide" : pageDivide
          };

          Download.mutateAsync(downloadData, {
            onSuccess: async (res: any) => {
              if (res.data !== undefined || "") {
                const byteArray = new Uint8Array(res.data[0].fileData.data);
                const file = window.URL.createObjectURL(new Blob([byteArray], { type: 'application/octet-stream' }));

                // const file = window.URL.createObjectURL(new Blob([res.data], { type: res.headers['content-type'] }));

                let extension;
                if (!fileExtension) {
                  extension = '.xlsx';
                } else {
                  extension = '.pdf';
                }

                // log("res.data4", typeof res.data, typeof res.data.fileData, res.data)
                downloadBlobFile(file, fileName[0].concat(extension));
              } else {
                if (res.success !== undefined || null) {
                  if (res.success === false) {
                    toastError(res.errorMessage);
                  } else {
                    toastError("잠시 후에 다시 시도해주세요.");
                  }
                } else {
                  toastError("잠시 후에 다시 시도해주세요.");
                }
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

  const handleButtonClick = (e:any)=>{
    if(e.target.id){
      dispatch({isMailSendPopupOpen : true })
    }
  }

  return (
    <div className="sticky top-0 z-20 flex w-full pt-10 space-y-1 bg-white">
        <PageBKTabContent
          right={
            <>
              <div className={"flex col-span-2"}>
              {/* handleButtonClick btn_transport_send_email*/}
                <Button id={"btn_send_email"} label="send_email" width="w-24" onClick={handleButtonClick} disabled={false}/>
                <DropButton id={"download"} width="w-24" dataSrc={reporttype as data} options={{ keyCol :"report_type_nm" }} onClick={onDropButtonClick} />
                <Button id={"save"} onClick={onSave} width="w-24" toolTip="ShortCut: Ctrl+S" />
              </div>                
              <div className={"flex col-span-2"}>
                <div className ={"flex px-1 mx-1 space-x-1 rounded-full border"}>
                  <RadioGroup label=''>
                      <Radio id ="search_gubn" name="download" value="0" label="excel" defaultChecked/>
                      <Radio id ="search_gubn" name="download" value="1" label="pdf" />
                  </RadioGroup>
                </div>
                {/* <ICONButton id="clipboard" disabled={false} onClick={onRefresh} size={'24'} /> */}
                  <ICONButton id="clipboard" disabled={false} onClick={onClipboard} size={'24'}  />
                  <ICONButton id="bkcopy" disabled={false} onClick={onBKCopy} size={'24'}  />
                  <ICONButton id="refresh" disabled={false} onClick={onRefresh} size={'24'} />
              </div>
            </>
          }
          bottom={<SubMenuTab tabList={loadItem[14].data} onClickTab={onClickTab} />}
          //addition={<div className="w-2/12"></div>}
        >
          <EmailSendPopup loadItem={loadItem} bk_id={bkData?.bk_id} transport_company={bkData?.transport_company} shipper_id={bkData?.shipper_id}/>
               
          <div className="flex flex-col">
            <div className="flex items-center justify-center w-full">
              <StepList stateList={stateList} state={bkData?.state}/>
            </div>
          
            <div className="flex flex-row">
              <div className="gap-2 mt-2">
                <MaskedInputField id="bk_id" lwidth='w-24' width="w-40" height='h-8' value={bkData?.bk_id} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
                <MaskedInputField id="vocc_id" lwidth='w-24' width="w-40" height='h-8' value={bkData?.vocc_id} options={{ isReadOnly: true, inline: true, textAlign : 'center'}} />
              </div>
              <div className="gap-2 mt-2">
                <MaskedInputField id="waybill_no" lwidth='w-24' width="w-40" height='h-8' value={bkData?.waybill_no} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
                <MaskedInputField id="mwb_no" lwidth='w-24' width="w-40" height='h-8' value={bkData?.mwb_no} options={{ isReadOnly: true, inline: true, textAlign : 'center'}} />
              </div>
              <div className="gap-2 mt-2">
                <MaskedInputField id="create_user" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_user} options={{ isReadOnly: true, inline: true, textAlign: 'center', }} />
                <MaskedInputField id="create_date" lwidth='w-24' width="w-40" height='h-8' value={bkData?.create_date} options={{ isReadOnly: true, inline: true, textAlign: 'center', type: 'date'  }} />
              </div>
            </div>
          </div>
        </PageBKTabContent>
    </div>
  );
});


export default BKMainTab