import DialogBasic from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
// import { SP_UpdateData } from "../../_store/data";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../../_store/store";

import { log, error } from '@repo/kwe-lib-new';
import { FileOptions } from "buffer";

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

  const handleFileDrop = async (data: any, header?: any[], file?:any) => {
    type FileOption = {
      file_nm: string,
      header: number,
      key_col: string
    }
    const fileOptions: FileOption[]  = ((state.loadDatas ?? [])[2].data as []);
    const headerRow = fileOptions.filter((row:any) => file.name.toLowerCase().includes(row.file_nm))[0]["header"] || 1; 

    const columnNames = data[headerRow - 1] as string[]; // 헤더 행 추출
    const existsDBKey = new Set(((state.loadDatas ?? [])[4].data as []).map(item => Object.values(item)[0]));
    const existsExcelKey = (fileOptions.filter((row:any) => file.name.toLowerCase().includes(row.file_nm))[0]["key_col"]).split(',') || [];
    
    // 헤더 이후의 데이터 추출
    data = data.slice(headerRow).map((row:any) => {
        const rowArray = row as any[];
        const rowObject: Record<string, any> = {};
        columnNames.forEach((col: string, index: number) => {
          if (rowArray[index] instanceof Date) {
            rowObject[col] = rowArray[index].toISOString();
          } else {
            rowObject[col] = rowArray[index]
          }
        });
        
        return rowObject;
    });
    
    const filter = file.name.toLowerCase().includes("p5s1")
                  ? (state.loadDatas ?? [])[1].data as [] : (state.loadDatas ?? [])[0].data as [];

    
    type GroupedFilter = {
      [key: string]: {
        values: string[];
        isSame: boolean[];
      };
    }
    const groupedFilter:GroupedFilter = filter.reduce((acc:any, row:any) => {
      const {col_nm, value, issame} = row;

      if (!acc[col_nm]) acc[col_nm] = { values:[value], isSame: [issame]};
      else {
        acc[col_nm].values.push(value);
        acc[col_nm].isSame.push(issame);
      }

      return acc;
    }, {});

    data = data.filter((row:any) => {

      /* 1. 이미 DB에 insert된 bl + dn 제외 */
      if (existsDBKey.size > 0) {
        const keyData = existsExcelKey.reduce((acc, col_nm) => {
          const value = row[col_nm] ? String(row[col_nm]) : '';
          return acc + value.replace(/[\t\n\r ]/g, '');
        }, '');
        
        if (existsDBKey.has(keyData)) return false; 
      }

      /* 2. 필터조건 처리 */
      return Object.entries(groupedFilter).every(([key, filterObj]:any) => {
        
        const { values, isSame } = filterObj;
        if (values.length > 1) {
          const idx = values.indexOf(row[key]);
          // 같은 키에 여러 값이 있으면 OR 조건
          return idx > -1 ? isSame[idx] == 'Y' : false;
        } else {
          if (row[key] === undefined) return true;

          // 같은 키에 하나의 값만 있으면 = 조건
          return isSame[0] === 'Y' ? (row[key] === values[0]) : ((row[key] ?? '') !== values[0])
        }
      });
    });

    // log("handleFileDrop", data)

    actions.insExcelData({jsonData: JSON.stringify(data), file: file})
            .then(async (response : {[key:string]:any}[] | undefined ) => {
              if (response) {
                const blForInipass = response[0]?.data?.reduce((acc: string, row: { [key: string]: string; }) => acc + ' ' + row["blforunipass"], '');
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
