import DialogBasic from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useEffect, useCallback } from "react";
import { crudType } from "components/provider/contextObjectProvider";
import { FileUpload } from "components/file-upload";
import { Button } from "components/button";
import { JsonToGridData } from "@/components/grid/ag-grid-enterprise";
import { DateInput, DatePicker } from "components/date";
import { useTranslation } from "react-i18next";
import ExcelUploadGrid from "./popupGrid";
import { Store } from "../../_store/store";
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
  const mainSelectedRow = Store((state) => state.mainSelectedRow);
  const state = Store((state) => state);
  const popup = Store((state) => state.popup);
  const excelData = Store((state) => state.excel_data);
  const actions = Store((state) => state.actions);

  const closeModal = async () => {
    actions.updatePopup({
      popType: "C",
      isPopupUploadOpen: false,
    });
    actions.setExcelDatas({ data: {}, fields:{} });
  };

  useEffect(() => {
    if (
      loadItem &&
      mainSelectedRow &&
      Object.keys(mainSelectedRow).length > 0
    ) {
    }
  }, [mainSelectedRow, loadItem]);

  useEffect(() => {
    reset();
    if (state.popup.popType === crudType.CREATE) {
      setFocus("use_yn");
    }
  }, [state.popup.popType, state.popup.isOpen]);

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
   // actions.getTransportDatas(params);
  }, [popup.popType, excelData]);

  const handleFileDrop = (data: any[], header: any[]) => {
    log("excel upload data", data);
    //TODO - NOT KWE WAYBILL- CNEE ID, NAME 어떻게 관리할건지? 고민필요
    const mappingConfig = [
        { key: "cnee_id", index: 1, default: "" },
        { key: "cnee_name", index: 2 },
        { key: "waybill_no", index: 3, default: "-" }, // AWB NO
        { key: "customs_duty", index: 4, vat: false }, // 관세
        { key: "customs_tax", index: 5, vat: false }, // 부가세
        { key: "bonded_wh", index: 6, vat: true }, // 창고료/1.1
        { key: "customs_clearance", index: 7, vat: true }, // 통관료/1.1
        { key: "dtd_handling", index: 8, vat: true }, // K/수수료/1.1
        { key: "trucking", index: 9, vat: true }, // 운송료/1.1
        { key: "other_1", index: 10, vat: true }, // 보험료/1.1
        { key: "air_freight", index: 11, vat: false }, // 항공료
        { key: "bl_handling", index: 12, vat: true },   // H/C/1.1
        { key: "dispatch_fee", index: 13, vat: true }, // 개청료/1.1
        // { key: "special_handling", index: 14, vat: true }, // 특별통관수수료/1.1
        // { key: "other_2", index: 15, vat: true }, // OTHER2/1.1
        // { key: "other_3", index: 16, vat: true }, // OTHER3/1.1
        { key: "sum", index: 14, default: 0 }, // 합계
        { key: "note", index: 15 }, // 비고
    ];

    const mappedData = data.map((row) => {
      const keys = Object.keys(row) as (keyof typeof row)[];
      return mappingConfig.reduce(
        (acc, { key, index, default: defaultValue, vat }) => {
          if (index !== undefined && keys[index] !== undefined) {
            let cellValue = row[keys[index]];

            // 쉼표 제거 후 숫자로 변환
            if (typeof cellValue === "string") {
              cellValue = cellValue.replace(/,/g, ""); // 쉼표 제거
            }
            if (vat && cellValue !== undefined && !isNaN(Number(cellValue))) {
              cellValue = Math.round(Number(cellValue) / 1.1);
            } else if (!isNaN(Number(cellValue))) {
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
    });

    const mappedHeader = mappingConfig.map(({ key }) => key);
    const gridData = JsonToGridData(mappedData, mappedHeader, 2);
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
        <div className="w-full gap-4 md:gap-8">
          <div className="flex w-[70vw] h-[70vh] p-1 border rounded-lg  mx-auto">
            <div className={"col-span-1"}>
              <DatePicker
                id="settlement_date"
                label="settlement_date"
                value={state.uiData?.settlement_date}
                options={{
                  inline: true,
                  textAlign: "center",
                  freeStyles: "p-1 border-1 border-slate-300",
                }}
                lwidth="w-20"
                height="h-8"
              />
            </div>
            <div className="w-full p-4">
              <FileUpload
                onFileDrop={handleFileDrop}
                isInit={state.uploadFile_init}
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
