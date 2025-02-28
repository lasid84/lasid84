import DialogBasic from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useEffect, useCallback, useState } from "react";
import { crudType } from "components/provider/contextObjectProvider";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import { JsonToGridData } from "@/components/grid/ag-grid-enterprise";
import { DatePicker } from "components/date";
import { useTranslation } from "react-i18next";
import ExcelUploadGrid from "./popupGrid";
import { useCommonStore } from "../../_store/store";
import { toastError, toastSuccess } from "@/components/toast";

import { log, error } from '@repo/kwe-lib-new';

type Callback = () => void;
type Props = {
  loadItem: any | null;
  callbacks?: Callback[];
};

const Modal: React.FC<Props> = ({ loadItem }) => {
  const { t } = useTranslation();
  const { getValues, reset, setFocus } = useFormContext();
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const state = useCommonStore((state) => state);
  const popup = useCommonStore((state) => state.popup);
  const excelData = useCommonStore((state) => state.excel_data);
  const actions = useCommonStore((state) => state.actions);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [mappingConfigs, setmappingConfigs] = useState<Item[]>([])
  
  const closeModal = async () => {
    actions.updatePopup({
      popType: "C",
      isPopupUploadOpen: false,
    });
    actions.setExcelDatas({ data: {}, fields: {} });
  };

interface Item {
  key: string;
  index: number;
  default?: string | number;
}


// useEffect(() => {
//     reset();
//     if (state.popup.popType === crudType.CREATE) {
//       setFocus("use_yn");
//     }
//   }, [state.popup.popType, state.popup.isOpen]);
  
  const onSave = useCallback(async () => {
    const params = getValues();
    const jsonData = JSON.stringify([excelData]);
    try {
      await actions.saveUploadData({
        jsondata: jsonData,
        settlement_date: params.settlement_date,
      });
    } catch {
      toastError("error");
    }
    toastSuccess("success");
    actions.updatePopup({
      isPopupUploadOpen: false,
    });
    actions.getDTDDatas(params);
  }, [popup.popType, excelData]);
  
  useEffect(() => {
    if (loadItem) {
      const columns = loadItem[2].data.map((item: Item) => item.key);
      setColumnNames(columns);
      setmappingConfigs(loadItem[2].data)
    }
  }, [loadItem]);
  
  const handleFileDrop = (data: any[], header: any[]) => {
    let headerRow = 7;
    data = data.slice(headerRow).map((row) => {
      const rowArray = row as any[]; 
      const rowObject: Record<string, any> = {};

      columnNames.forEach((col: string, index: number) => {
        rowObject[col] = rowArray[index];
      });

      return rowObject;
    });

    let lastWaybillNo: string | null = null; // 이전 청구 데이터의 waybill_no를 저장할 변수
    const mappedData = data
      .filter((row) => {
        // row가 빈 배열인 경우 제외
        const keys = Object.keys(row) as (keyof typeof row)[];
        return (
          keys.length > 0 &&
          Object.values(row).some(
            (value) => value !== null && value !== undefined
          )
        );
      })
      .map((row) => {
        log('row',row)
        const keys = Object.keys(row) as (keyof typeof row)[];

        // 현재 row 매핑
        const parsedRow = mappingConfigs.reduce(
          (acc:any, { key, index, default: defaultValue }: Item) => {
            if (index !== undefined && keys[index] !== undefined) {
              let cellValue = row[keys[index]];

              // 쉼표 제거 후 숫자로 변환
              if (typeof cellValue === "string") {
                cellValue = cellValue.replace(/,/g, ""); // 쉼표 제거
              }

              if (!isNaN(Number(cellValue))) {
                cellValue = Number(cellValue);
              }

              acc[key] =
                cellValue !== undefined && cellValue !== ""
                  ? cellValue
                  : defaultValue;
            } else {
              acc[key] = defaultValue ?? null; // index가 잘못되었거나 값이 없으면 null
            }
            return acc;
          },
          {} as Record<string, any>
        );

        // waybill_no 상속 처리
        if (parsedRow["category"] === "비용" && !parsedRow["waybill_no"]) {
          parsedRow["waybill_no"] = lastWaybillNo;
        }

        if (parsedRow["category"] === "청구" && parsedRow["waybill_no"]) {
          lastWaybillNo = parsedRow["waybill_no"];
        }

        // category 값 변경
        switch (parsedRow["category"]) {
          case "비용":
            parsedRow["category"] = "AB";
            break;
          case "청구":
            parsedRow["category"] = "RV";
            break;
        }
        return parsedRow;
      })
      .filter((row) => row["waybill_no"]); // waybill_no 없는 데이터 제거

    const mappedHeader = mappingConfigs.map(({ key }) => key);
    const gridData = JsonToGridData(mappedData, mappedHeader, 1);
    actions.setExcelDatas(gridData);
  };

  return (
    <DialogBasic
      isOpen={popup.isPopupUploadOpen!}
      onClose={closeModal}
      title={
        t("MSG_0187") + (popup.popType === crudType.CREATE ? "등록" : "수정")
      }
      bottomRight={
        <>
          <Button id={"save"} onClick={onSave} width="w-32" />
          <Button id={"cancel"} onClick={closeModal} width="w-32" />
        </>
      }
    >
      <form>
        <div className="w-full p-4">
          <div className="grid grid-cols-1 gap-4 w-[70vw] h-auto p-4 border rounded-lg mx-auto">
            {/* DatePicker Component */}
            <div className="flex justify-center w-full">
              <div className="w-80">
                <DatePicker
                  id="settlement_date"
                  label="Settlement Date"
                  value={state.uiData?.settlement_date}
                  options={{
                    inline: true,
                    textAlign: "center",
                    freeStyles:
                      "p-1 border border-slate-300 rounded-md text-base",
                  }}
                  lwidth="w-full"
                />
              </div>
            </div>

            {/* FileUpload Component */}
            <div className="w-full border rounded-lg">
              <FileUpload
                onFileDrop={handleFileDrop}
                isInit={state.uploadFile_init}
                headerRow={7}
                isReturnRawData={true}
              />
            </div>

            {/* ExcelUploadGrid Component */}
            <div className="w-full">
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
