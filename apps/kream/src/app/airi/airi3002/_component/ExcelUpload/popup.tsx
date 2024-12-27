import DialogBasic from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useMemo, useState, useEffect, useCallback, memo } from "react";
import {
  crudType,
} from "components/provider/contextObjectProvider";
// import { SP_UpdateData } from "../../_store/data";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../../_store/store";
import { useUserSettings } from "@/states/useUserSettings";

const { log } = require("@repo/kwe-lib/components/logHelper");

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

  // useEffect(() => {
  //   reset();
  //   if (popType === crudType.CREATE) {
  //     setFocus("use_yn");
  //   }
  // }, [popType, isOpen]);

  const onSave = useCallback(async () => {
    var param = getValues();
    // // try {
    // if (popType === crudType.UPDATE) {
    //   const jsonData = JSON.stringify([param]);
    //   // log("onSave1", jsonData)
    //   await Update.mutateAsync(
    //     { jsondata: jsonData },
    //     {
    //       onSuccess: (res: any) => {
    //         closeModal();
    //       },
    //     }
    //   ).catch((err) => {});
    // } else {

    //   // await Create.mutateAsync(param, {
    //   //   onSuccess(data, variables, context) {
    //   //     closeModal();
    //   //   },
    //   //   onError(error, variables, context) {},
    //   // }).catch((err) => {});
    // }
    // // dispatch({ isMSearch: true });
    // // } catch(err) {
    // //     log("catch err", err)
    // // }
  }, [popType]);

  const handleFileDrop = (data: any[], header: any[], file:any) => {

    const headerRow = ((state.loadDatas ?? [])[2].data as [])
                        .filter((row:any) => file.name.toLowerCase().includes(row.file_nm))[0]["header"] || 1; 

    const columnNames = data[headerRow - 1] as string[]; // 헤더 행 추출

    // 헤더 이후의 데이터 추출
    data = data.slice(headerRow).map((row) => {
        const rowArray = row as any[]; // row를 배열로 캐스팅
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
    console.log(data[10]);
    actions.insExcelData({jsonData: JSON.stringify(data), file: file});
  };

  return (
    <DialogBasic
      isOpen={isPopUpUploadOpen}
      onClose={closeModal}
      title={t("upload_excel")}
      bottomRight={
        <>
          <Button id={"save"} onClick={onSave} width="w-32" />
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full gap-4 md:gap-8">
          <div className="flex w-[70vw] h-[70vh] p-1 border rounded-lg  mx-auto">
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
          </div>
        </div>
      </form>
    </DialogBasic>
  );
};

export default Modal;
