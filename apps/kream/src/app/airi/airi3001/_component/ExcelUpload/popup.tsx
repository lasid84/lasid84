import DialogBasic from "layouts/dialog/dialog";
import {
  Controller,
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import {
  gridData,
  JsonToGridData,
  ROW_TYPE,
  ROW_TYPE_NEW,
} from "@/components/grid/ag-grid-enterprise";
import { useTranslation } from "react-i18next";
import ExcelUploadGrid from "./popupGrid";
import { Store } from "../../_store/store";

import { log, error } from '@repo/kwe-lib-new';

type Callback = () => void;
type Props = {
};

const Modal: React.FC<Props> = ({ }) => {
  const { t } = useTranslation();
  const { getValues, setValue, reset, setFocus, handleSubmit } = useFormContext();
  const {mainSelectedRow, popup, loadDatas} = Store((state)=>state)
  const actions = Store((state)=>state.actions)

  const closeModal = async () => {
    actions.updatePopup({
      isPopupUploadOpen: false,
    });
    actions.setState({excelDatas:{data:[], fields:[]}});
  };

  // const handleFileDrop = (data: any[], header: any[]) => {
  //   console.log('header', header)
  //   const mappedData = data.map((row) => {  
  //     const keys = Object.keys(row);  
  //     return {
  //       importidentification: row[keys[10]], 
  //       declarationdate: row[keys[31]],      
  //       arrivalport: row[keys[37]],          
  //       dispatchcountry: row[keys[43]],      
  //       hawb: row[keys[47]],                 
  //       mawb: row[keys[48]],                 
  //       totaldeclvalue: row[keys[53]],       
  //       incoterms: row[keys[57]],          
  //       exchangerate: row[keys[60]],        
  //       transportfee: row[keys[64]],      
  //       insurancefee: row[keys[67]],       
  //       customsclearancedate: row[keys[94]], 
  //       customsclearancetime: new Date().toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, ""), // HHMMSS
  //       declarationlinenumber: row[keys[112]],
  //       hazardcode: row[keys[117]],           
  //       currency: "KRW",                    
  //       partnumber: row[keys[173]],         
  //       declarationcustomsvalue: row[keys[118]], 
  //       importduties: row[keys[124]],       
  //       localconsumptiontax: row[keys[130]],
  //       importvatliability: row[keys[143]],  
  //       importdutyrate: row[keys[121]],      
  //     }
  //   })
  //   const mappedHeader = [
  //     "importidentification", // importidentification
  //     "declarationdate",          // declarationdate
  //     "arrivalport",            // arrivalport
  //     "dispatchcountry",        // dispatchcountry
  //     "hawb",           // hawb
  //     "mawb",    // mawb
  //     "totaldeclvalue",    // totaldeclvalue
  //     "incoterms",          // incoterms
  //     "exchangerate",          // exchangerate
  //     "transportfee",          // transportfee
  //     "insurancefee",          // insurancefee
  //     "customsclearancedate",          // customsclearancedate
  //     "customsclearancetime",          // customsclearancetime
  //     "declarationlinenumber",            // declarationlinenumber
  //     "hazardcode",          // hazardcode
  //     "currency",          // currency
  //     "partnumber",          // partnumber
  //     "declarationcustomsvalue",  // declarationcustomsvalue
  //     "importduties",              // importduties
  //     "localconsumptiontax",            // localconsumptiontax
  //     "importvatliability",            // importvatliability
  //     "importdutyrate",              // importdutyrate
  //   ];
  
    
  
  //   const gridData = JsonToGridData(mappedData, header, 2);
  //   console.log('excel data', gridData);     
  //   dispatch({ excel_data: gridData });
  // };
  
  const handleFileDrop = (data: any[], header: any[]) => {
    // const mappingConfig = [
    //   { key: "importidentification", index: 10 },
    //   { key: "declarationdate", index: 31 },
    //   { key: "arrivalport", index: 37 },
    //   { key: "dispatchcountry", index: 43 },
    //   { key: "hawb", index: 47 },
    //   { key: "mawb", index: 48 },
    //   { key: "totaldeclvalue", index: 53 },
    //   { key: "incoterms", index: 57 },
    //   { key: "exchangerate", index: 60 },
    //   { key: "transportfee", index: 64 },
    //   { key: "insurancefee", index: 67 },
    //   { key: "customsclearancedate", index: 94 },
    //   { key: "customsclearancetime", dynamic: () => 
    //     new Date().toLocaleTimeString("en-GB", { hour12: false }).replace(/:/g, "") },
    //   { key: "declarationlinenumber", index: 112 },
    //   { key: "hazardcode", index: 117 },
    //   { key: "currency", default: "KRW" },
    //   { key: "partnumber", index: 173 },
    //   { key: "declarationcustomsvalue", index: 118 },
    //   { key: "importduties", index: 124 },
    //   { key: "localconsumptiontax", index: 130 },
    //   { key: "importvatliability", index: 143 },
    //   { key: "importdutyrate", index: 121 },
    // ];
  
    // const mappedData = data.map((row) => {
    //   const keys = Object.keys(row) as (keyof typeof row)[];
    //   return mappingConfig.reduce((acc, { key, index, default: defaultValue, dynamic }) => {
    //     if (dynamic) {
    //       acc[key] = dynamic();
    //     } else if (index !== undefined && keys[index]) {
    //       acc[key] = row[keys[index]] ?? defaultValue;
    //     } else {
    //       acc[key] = defaultValue ?? null; // index가 잘못된 경우 null로 대체
    //     }
    //     return acc;
    //   }, {} as Record<string, any>);
    // });
  
    // const mappedHeader = mappingConfig.map(({ key }) => key);  
    // const gridData = JsonToGridData(mappedData, mappedHeader, 2);  

    const fileOptions = ((loadDatas ?? [])[4].data as Array<{header: number}>) ;
    const headerRow = fileOptions[0] ? fileOptions[0]['header'] : 1; 

    const columnNames = data[headerRow - 1] as string[]; // 헤더 행 추출
    
    // 헤더 이후의 데이터 추출
    data = data.slice(headerRow).map((row) => {
      const rowArray = row as any[];
      const rowObject: Record<string, any> = {};
      columnNames.forEach((col: string, index: number) => rowObject[index+1] = rowArray[index]);
      
      return rowObject;
    });

    actions.getExcelCustomsData({jsonData: JSON.stringify(data)});
  };
  


  return (
    <DialogBasic
      isOpen={popup.isPopupUploadOpen!}
      onClose={closeModal}
      title={t("MSG_0186")}
      bottomRight={
        <>
          {/* <Button id={"save"} onClick={onSave} width="w-32" /> */}
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full gap-4 md:gap-8">
          <div className="flex w-[75vw] h-[70vh] p-1 border rounded-lg  mx-auto">
            <div className="w-full p-4">
              <FileUpload
                onFileDrop={handleFileDrop}
                isReturnRawData={true}
              />
                <ExcelUploadGrid
                  params={{
                    waybill_no: mainSelectedRow?.waybill_no,
                    invoice_no: mainSelectedRow?.invoice_no,
                  }}
                />
            </div>
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
