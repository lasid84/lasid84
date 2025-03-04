import { DialogArrow } from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useState, useEffect, useCallback, MouseEventHandler } from "react";
import { crudType } from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import { Button } from "components/button";
import { toastError } from "components/toast";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { DatePicker } from "@/components/date/react-datepicker";
import { useTranslation } from "react-i18next";
import { useCommonStore, AmountInputOptions } from "../../_store/store";
import { toastSuccess } from "components/toast";
import { ReactSelect, data } from "@/components/select/react-select2";
import Amount from "./popupAmount";
import Balance from "./popupFooter";

import { log, error } from "@repo/kwe-lib-new";

type Callback = () => void;
type Props = {
  loadItem: any[] | null;
  callbacks?: Callback[];
};

const Modal = ({ loadItem }: Props) => {
  const { t } = useTranslation();

  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const detailRVDatas = useCommonStore((state) => state.detailRVDatas);
  const detailABDatas = useCommonStore((state) => state.detailABDatas);
  const detailIndex = useCommonStore((state) => state.detailIndex);
  const allDataLength = useCommonStore((state) => state.allData.length);

  const searchParams = useCommonStore((state) => state.searchParams);
  const popup = useCommonStore((state) => state.popup);
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const [waybillgubn, setWaybillgubn] = useState<any>();

  const closeModal = async () => {
    actions.updatePopup({
      popType: "U",
      isPopupOpen: false,
    });
  };

  useEffect(() => {
    if (loadItem?.length) {
      setWaybillgubn(loadItem[8]);
    }
  }, [loadItem]);

  const onClickeventBefore = async () => {
    var beforeIndexNum2 = state.detailIndex - 1;
    if (beforeIndexNum2 >= 0) {
      actions.setDetailIndex(beforeIndexNum2);
    } else {
      toastError(t("MSG_0197"));
    }
  };

  const onClickeventAfter = async () => {
    const nextIndexnum = state.currentRow?.__ROWINDEX + 2;
    var nextDetailidx = state.detailIndex + 1;
    if (nextDetailidx < Math.floor(state.allData.length / 2)) {
      actions.setDetailIndex(nextDetailidx);
    } else {
      toastError(t("MSG_0198"));
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "PageUp") {
        onClickeventAfter();
      } else if (event.key === "PageDown") {
        onClickeventBefore();
      }
    },
    [onClickeventBefore, onClickeventAfter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem) {
      // setIncoterms(loadItem[1]);
      setCustcode(loadItem[1]);
    }
  }, [loadItem]);

  useEffect(() => {
    if (
      loadItem &&
      mainSelectedRow &&
      Object.keys(mainSelectedRow).length > 0 &&
      detailRVDatas &&
      Object.keys(detailRVDatas).length > 0
    ) {
      log("detailRVDatas", detailRVDatas);
    }
  }, [mainSelectedRow, loadItem, detailRVDatas]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (popup.isPopupOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [popup.isPopupOpen]);

  const onSave1 = async (param: MouseEventHandler | null) => {
    if (!detailRVDatas) return;
    if (!detailABDatas) return;

    const mergedArray = Object.values(detailRVDatas).map(
      (item: any, index: number) => {
        // `waybill_no`와 `seq`를 조합하여 고유값 생성
        const uniqueKey = `${item.waybill_no}_${item.seq}`;
        const matchingItem = Object.values(detailABDatas).find(
          (obj: any, i: number) =>
            // i === index && obj.waybill_no === item.waybill_no
            `${obj.waybill_no}_${obj.seq}` === uniqueKey
        );

        return {
          ...item,
          ...(matchingItem || {}),
        };
      }
    );
    const result = await actions.saveDomesticINVDetailDatas({
      jsondata: JSON.stringify(mergedArray),
    });
    log("mergedarray", mergedArray);
    if (result) {
      toastSuccess("success");
      closeModal();
      actions.getDTDDatas(searchParams);
    }
  };

  const handleOnClickB = () => {
    window.open("/airi/airi4003", "_blank"); // 현재 도메인 유지하고 새 탭에서 열기
  };

  const handleonSelectionChanged = (e: any, id: any, value: any) => {
    if (!e) return;
    actions.updateDetailRVField(detailRVDatas, detailIndex, id, value);
  };

  const handleonChange = (e: any) => {
    if (!e) return;
    actions.updateDetailRVField(
      detailRVDatas,
      detailIndex,
      e.target.id,
      e.target.value
    );
  };

  return (
    <>
      <div className="">
        <DialogArrow
          isOpen={state.popup.isPopupOpen!}
          onClose={closeModal}
          title={
            t("MSG_0192") +
            (state.popup.popType === crudType.CREATE ? "등록" : "수정")
          }
          subtitle={
            <>
              <div className="flex w-full p-1 px-1">
                <MaskedInputField
                  id="settlement_type_nm"
                  label={"settlement_type"}
                  width="w-28"
                  lwidth="w-10"
                  value={detailRVDatas?.[detailIndex]?.settlement_type_nm || ""}
                  options={{
                    noLabel: false,
                    inline: true,
                    isReadOnly: true,
                    fontSize: "lg",
                    fontWeight: "semibold",
                  }}
                />

                <MaskedInputField
                  id="cnee_id"
                  label="cnee_id"
                  value={detailRVDatas?.[detailIndex]?.cnee_id}
                  width="w-32"
                  options={{
                    inline: true,
                    isReadOnly: true,
                  }}
                />
                <CustomSelect
                  key={detailIndex}
                  id="cnee_id"
                  label="l_cnee_id"
                  initText="Select a Consignee"
                  listItem={custcode as gridData}
                  valueCol={["cust_code"]}
                  displayCol="cust_nm"
                  lwidth="8"
                  gridOption={{
                    colVisible: {
                      col: ["cust_code", "cust_nm", "bz_reg_no"],
                      visible: true,
                    },
                  }}
                  gridStyle={{ width: "600px", height: "300px" }}
                  style={{ width: "1200px", height: "8px" }}
                  isDisplay={true}
                  isReadOnly={
                    detailRVDatas?.[detailIndex]?.state == state.closing
                  }
                  defaultValue={detailRVDatas?.[detailIndex]?.cnee_id || ""}
                  inline={true}
                />
              </div>
            </>
          }
          description={
            <>
              <div className="flex">
                <MaskedInputField
                  id="state_nm"
                  width="w-32"
                  value={detailRVDatas?.[detailIndex]?.state_nm}
                  options={{
                    inline: true,
                    isReadOnly: true,
                    fontSize: "lg",
                    fontWeight: "semibold",
                  }}
                />
              </div>
            </>
          }
          bottomRight={
            <>
              <Button id={"save"} onClick={onSave1} width="w-32" />
              <Button id={"cancel"} onClick={closeModal} width="w-32" />
            </>
          }
        >
          <form>
            <div className="w-full max-w-screen-lg gap-4 md:gap-8">
              <div className="flex w-full p-1 border rounded-lg">
                <div className="col-span-1">
                  <div className="grid grid-cols-2 gap-4">
                    <MaskedInputField
                      id="waybill_no"
                      value={detailRVDatas?.[detailIndex]?.waybill_no}
                      options={{
                        bgColor: "!bg-yellow-100",
                        inline: true,
                        isReadOnly: true,
                      }}
                    />

                    <CustomSelect
                      id="waybill_gubn"
                      listItem={waybillgubn as gridData}
                      valueCol={["waybill_gubn"]}
                      displayCol="waybill_gubn_nm"
                      gridOption={{
                        colVisible: {
                          col: ["waybill_gubn", "waybill_gubn_nm"],
                          visible: true,
                        },
                      }}
                      events={{
                        onSelectionChanged: handleonSelectionChanged,
                      }}
                      gridStyle={{ width: "400px", height: "150px" }}
                      style={{ width: "600px", height: "8px" }}
                      isDisplay={true}
                      isReadOnly={
                        detailRVDatas?.[detailIndex]?.state == state.closing
                      }
                      defaultValue={
                        detailRVDatas?.[detailIndex]?.waybill_gubn || ""
                      }
                      inline={true}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MaskedInputField
                      id="ci_invoice"
                      label="invoice_no"
                      value={detailRVDatas?.[detailIndex]?.ci_invoice}
                      options={{
                        inline: true,
                        isReadOnly:
                          detailRVDatas?.[detailIndex]?.state == state.closing,
                      }}
                      events={{
                        onChange: handleonChange,
                      }}
                    />

                    <MaskedInputField
                      id="gross_wt"
                      value={detailRVDatas?.[detailIndex]?.gross_wt || ""}
                      options={{
                        inline: true,
                        isReadOnly:
                          detailRVDatas?.[detailIndex]?.state == state.closing,
                      }}
                    />
                  </div>
                  <MaskedInputField
                    id="total"
                    value={detailRVDatas?.[detailIndex]?.total_tot || ""}
                    options={{
                      type: "number",
                      textAlign: "right",
                      limit: 9,
                      isAllowDecimal: true,
                      decimalLimit: 0,
                      disableSpacing: true,
                      fontSize: "base",
                      fontWeight: "bold",
                      bgColor: "!bg-sky-200",
                      inline: true,
                      isReadOnly: true,
                    }}
                  />

                  <MaskedInputField
                    id="seq"
                    value={detailRVDatas?.[detailIndex]?.seq || ""}
                    isDisplay={false}
                    options={{
                      bgColor: " none",
                      inline: true,
                    }}
                  />
                </div>
                <div className="col-span-2 px-1">
                  <div className="grid grid-cols-2 gap-1">
                    <DatePicker
                      id="eta"
                      value={detailRVDatas?.[detailIndex]?.eta || ""}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <DatePicker
                      id="create_date"
                      value={detailRVDatas?.[detailIndex]?.create_date || ""}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <DatePicker
                      id="settlement_date"
                      value={
                        detailRVDatas?.[detailIndex]?.settlement_date || ""
                      }
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "p-1 border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <MaskedInputField
                      id="settlement_user"
                      value={
                        detailRVDatas?.[detailIndex]?.settlement_user || ""
                      }
                      options={{
                        inline: true,
                        textAlign: "center",
                        isReadOnly: true,
                      }}
                    />

                    <DatePicker
                      id="update_date"
                      value={detailRVDatas?.[detailIndex]?.update_date || ""}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <MaskedInputField
                      id="update_user"
                      value={detailRVDatas?.[detailIndex]?.update_user || ""}
                      options={{
                        inline: true,
                        isReadOnly: true,
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full h-4 space-x-2">
                <Button
                  id={"left"}
                  onClick={onClickeventBefore}
                  disabled={false}
                  isLabel={false}
                  width="w-14"
                />

                <Button
                  id={"right"}
                  onClick={onClickeventAfter}
                  disabled={false}
                  isLabel={false}
                  width="w-14"
                />
                <span className="text-gray-700">
                  {state.detailIndex + 1}
                  {" / "}
                  {Math.floor(allDataLength / 2)}
                </span>
              </div>
              <Amount loadItem={loadItem} />
              <Balance loadItem={loadItem} />
            </div>
          </form>
        </DialogArrow>
      </div>
    </>
  );
};

export default Modal;
