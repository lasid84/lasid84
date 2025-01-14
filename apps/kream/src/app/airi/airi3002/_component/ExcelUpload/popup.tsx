import DialogBasic from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
// import { SP_UpdateData } from "../../_store/data";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../../_store/store";

import { log, error } from '@repo/kwe-lib-new';

type Callback = () => void;
type Props = {
  loadItem?: any | null;
  callbacks?: Callback[];
};

const Modal: React.FC<Props> = () => {
  
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const { crudType: popType, isPopUpUploadOpen = false} = state.popup;

  const { t } = useTranslation();
  //const { Create } = useUpdateData2(SP_InsertCustData);
  // const { Update } = useUpdateData2(SP_UpdateData);
  const { getValues, setValue, reset, setFocus, handleSubmit } =
    useFormContext();

  const closeModal = async () => {
    actions.setState({popup:{...state.popup, isPopUpUploadOpen:false}});
  };

  const handleFileDrop = async (data: any[], header: any[], file:any) => {

    const fileOptions = ((state.loadDatas ?? [])[2].data as []);
    const headerRow = fileOptions.filter((row:any) => file.name.toLowerCase().includes(row.file_nm))[0]["header"] || 1; 


    const columnNames = data[headerRow - 1] as string[]; // 헤더 행 추출
    const existsBL = new Set(((state.loadDatas ?? [])[4].data as []).map(item => Object.values(item)[0]));
    const existsBLKey = fileOptions.filter((row:any) => file.name.toLowerCase().includes(row.file_nm))[0]["bl_col"] || null;

    // 헤더 이후의 데이터 추출
    data = data.slice(headerRow).map((row) => {
        const rowArray = row as any[];
        const rowObject: Record<string, any> = {};
        columnNames.forEach((col: string, index: number) => rowObject[col] = rowArray[index]);
        
        return rowObject;
    });
    
    const filter = file.name.toLowerCase().includes("p5s1")
                  ? (state.loadDatas ?? [])[1].data as [] : (state.loadDatas ?? [])[0].data as [];

    if (filter?.length) {
      const groupedFilter = filter.reduce<Record<string, any[]>>((acc, { key, value }) => {
        acc[key] = acc[key] || [];
        acc[key].push(value);
        return acc;
      }, {});
      
      data = data.filter((row) => {

        if (existsBLKey && row[existsBLKey]) {
          const cleanedValue = row[existsBLKey].replace(/[\t\n\r ]/g, "");
          if (existsBL.has(cleanedValue)) return false; 
        }        

        return Object.entries(groupedFilter).every(([key, values]) => {
          
          if (values.length > 1) {
            // 같은 키에 여러 값이 있으면 OR 조건
            return values.includes(row[key]);
          } else {
            // 같은 키에 하나의 값만 있으면 = 조건
            return row[key] === values[0];
          }
        });
      });
    }
    log("file", file);
    actions.insExcelData({jsonData: JSON.stringify(data), file: file})
            .then(async (response : {[key:string]:any}[] | undefined ) => {
              if (response) {
                const blForInipass = response[0].data.reduce((acc: string, row: { [key: string]: string; }) => acc + ' ' + row["blforunipass"], '');
                // log("blForInipass", blForInipass);
                if (blForInipass) {
                  const params = {
                    blyy:response[0].data[0]["blyy"],
                    blno:blForInipass,
                  }
                  // await actions.getUnipassData(params);
                  await actions.getAppleDatas(getValues());
                  await actions.getLoad();
                  closeModal();
                }
              }
            });

  };

  return (
    <DialogBasic
      isOpen={isPopUpUploadOpen}
      onClose={closeModal}
      title={t("upload_excel")}
      bottomRight={
        <>
          {/* <Button id={"save"} onClick={onSave} width="w-32" /> */}
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full gap-4 md:gap-8">
          {/* <div className="flex w-[70vw] h-[70vh] p-1 border rounded-lg  mx-auto"> */}
            <div className="w-full p-4">
              <FileUpload
                onFileDrop={handleFileDrop}
                isReturnRawData={true}
                // headerRow={4}
                // isInit={objState.uploadFile_init}
              />
                {/* <DetailGrid
                  params={{
                    waybill_no: objState.mSelectedRow?.waybill_no,
                    invoice_no: objState.mSelectedRow?.invoice_no,
                  }}
                /> */}
            </div>
          {/* </div> */}
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
