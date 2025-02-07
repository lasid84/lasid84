import { DialogArrow } from "layouts/dialog/dialog";
import { useFormContext } from "react-hook-form";
import { useState, useEffect, MouseEventHandler } from "react";
import { crudType } from "components/provider/contextObjectProvider";
import { gridData } from "components/grid/ag-grid-enterprise";
import CustomSelect from "components/select/customSelect";
import { Button } from "components/button";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { DatePicker } from "@/components/date/react-datepicker";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../../_store/store";
import { toastSuccess } from "components/toast";

import Amount from "./popupAmount";

import { log, error } from "@repo/kwe-lib-new";

type Callback = () => void;
type Props = {
  loadItem: any[] | null;
  callbacks?: Callback[];
};

const Modal = ({ loadItem }: Props) => {
  const { t } = useTranslation();
  const detail: any[] = [];

  const { getValues, reset, setFocus } = useFormContext();
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const detailSelectedRow = useCommonStore((state) => state.detailSelectedRow);
  const popup = useCommonStore((state) => state.popup);
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);

  const closeModal = async () => {
    actions.updatePopup({
      popType: "U",
      isPopupOpen: false,
    });
  };

  //Set select box data
  const [incoterms, setIncoterms] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (loadItem) {
      setIncoterms(loadItem[1]);
      setCustcode(loadItem[1]);
    }
  }, [loadItem]);

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

  // const SaveDetail = async () => {
  //   let hasData = false;
  //   // const allColumns = state.gridRef_Detail?.current?.api.getAllGridColumns();
  //   const allColumns = state.detailDatas;
  //   // log("saveDetail? allColumns", allColumns);
  //   // await state.gridRef_Detail.current.api.forEachNode((node: any) => {
  //   //   if (node.data[ROW_CHANGED]) {
  //   //     hasData = true;
  //   //     var data = {
  //   //       ...node.data,
  //   //     };
  //   //     log("data", data);
  //   //     detail.push(data);
  //   //   }
  //   // });

  //   return hasData;
  // };

  const onSave = async (param: MouseEventHandler | null) => {
    const detail: any[] = [];
    let curData = getValues();
    detail.push(curData);
    // console.log("curData", curData, state.popup.popType);
    const result = await actions.saveDTDDetailData({
      jsondata: JSON.stringify(detail),
    });
    if (result) {
      //log('success')
      toastSuccess("success");
      // actions.getDTDDatas(getValues());
    }
  };

  useEffect(() => {
    if (state.detailSelectedRow) {
      log("Detail selected row changed:", state.detailSelectedRow);
      // 필요한 추가 로직
    }
  }, [state.detailSelectedRow]);

  const onClickeventBefore = async () => {
    const userConfirmed = window.confirm(t("MSG_0012") || ""); //템플릿을 저장하시겠습니까?

    if (userConfirmed) {
      const detail: any[] = [];
      let curData = getValues();
      detail.push(curData);
      const result = await actions.saveDTDDetailData({
        jsondata: JSON.stringify(detail),
      });
      if (result) {
      }
    }

    const prevIndexnum = state.currentRow?.__ROWINDEX - 2;

    const prevRowData = state.allData.find(
      (row) => row.__ROWINDEX === prevIndexnum
    );

    if (prevRowData) {
      actions.getDTDDetailDatas(prevRowData);
      actions.setCurrentRow(prevRowData);
    } else {
      log("No data :", prevIndexnum);
    }
  };

  const onClickeventAfter = async () => {
    const userConfirmed = window.confirm(t("MSG_0012") || ""); //템플릿을 저장하시겠습니까?

    if (userConfirmed) {
      const detail: any[] = [];
      let curData = getValues();
      detail.push(curData);
      const result = await actions.saveDTDDetailData({
        jsondata: JSON.stringify(detail),
      });
      if (result) {
      }
    }

    const nextIndexnum = state.currentRow?.__ROWINDEX + 2;

    // nextIndexnum과 동일한 rowIndex를 가진 데이터 찾기
    const nextRowData = state.allData.find(
      (row) => row.__ROWINDEX === nextIndexnum
    );

    if (nextRowData) {
      actions.getDTDDetailDatas(nextRowData);
      actions.setCurrentRow(nextRowData);
    } else {
      log("No data found for next index:", nextIndexnum);
    }
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
                  id="cal_issue_or_nm"
                  label="l_gubn"
                  width="w-32"
                  value={detailSelectedRow?.cal_issue_or_nm}
                  options={{
                    inline: true,
                    isReadOnly: true,
                    fontSize: "lg",
                    fontWeight: "semibold",
                  }}
                />

                <MaskedInputField
                  id="cnee_id"
                  label="cnee_id"
                  value={detailSelectedRow?.cnee_id}
                  width="w-32"
                  options={{
                    inline: true,
                    isReadOnly: true,
                  }}
                />
                {/* <div className="flex-1 max-w-[1000px]"> */}
                <CustomSelect
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
                  defaultValue={detailSelectedRow?.cnee_id}
                  inline={true}
                />
                {/* </div> */}
              </div>
            </>
          }
          description={
            <>
              <div className="flex">
                <MaskedInputField
                  id="state"
                  width="w-32"
                  value={detailSelectedRow?.state}
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
              <Button id={"save"} onClick={onSave} width="w-32" />
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
                      value={detailSelectedRow?.waybill_no}
                      options={{
                        bgColor: "!bg-yellow-100",
                        inline: true,
                        isReadOnly: true,
                      }}
                    />
                    <MaskedInputField
                      id="waybill_gubn"
                      value={detailSelectedRow?.waybill_gubn}
                      options={{
                        bgColor: "!bg-gray-100",
                        inline: true,
                        isReadOnly: true,
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <MaskedInputField
                      id="ci_invoice"
                      label="invoice_no"
                      value={detailSelectedRow?.ci_invoice}
                      options={{
                        bgColor: "!bg-gray-100",
                        inline: true,
                        isReadOnly: true,
                      }}
                    />

                    <MaskedInputField
                      id="gross_wt"
                      value={detailSelectedRow?.gross_wt}
                      options={{
                        bgColor: "!bg-gray-100",
                        inline: true,
                        isReadOnly: true,
                      }}
                    />
                  </div>
                  {/* <input className="hidden" value={detailSelectedRow?.seq} /> */}
                  <MaskedInputField
                      id="seq"
                      value={detailSelectedRow?.seq}
                      isDisplay={false}
                      options={{
                        bgColor: " none",
                        inline: true,
                        isReadOnly:
                          popup.popType === crudType.CREATE ? false : true,
                      }}
                    />     
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <MaskedInputField
                        id="total"
                        value={detailSelectedRow?.total}
                        isDisplay={true}
                        options={{
                          bgColor: " disable",
                          inline: true,
                          isReadOnly:
                            popup.popType === crudType.CREATE ? false : true,
                          
                        }}
                      />
                    </div>
                  </div> */}
                </div>
                <div className="col-span-2 px-1">
                  <div className="grid grid-cols-2 gap-1">
                    <DatePicker
                      id="settlement_date"
                      value={detailSelectedRow?.settlement_date}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "p-1 border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <DatePicker
                      id="eta"
                      value={detailSelectedRow?.eta}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <DatePicker
                      id="create_date"
                      value={detailSelectedRow?.create_date}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <MaskedInputField
                      id="create_user"
                      value={detailSelectedRow?.create_user}
                      options={{
                        inline: true,
                        textAlign: "center",
                        isReadOnly: true,
                      }}
                    />
                    <DatePicker
                      id="update_date"
                      value={detailSelectedRow?.update_date}
                      options={{
                        inline: true,
                        textAlign: "center",
                        freeStyles: "border-1 border-slate-300",
                        isReadOnly: true,
                      }}
                    />
                    <MaskedInputField
                      id="update_user"
                      value={detailSelectedRow?.update_user}
                      options={{
                        inline: true,
                        isReadOnly: true,
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center w-full space-x-2">
                <div
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={onClickeventBefore}
                >
                  {"<"}
                </div>
                <div
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={onClickeventAfter}
                >
                  {">"}
                </div>
                <span className="text-gray-700">
                  {" "}
                  {Math.floor(state.currentRow?.__ROWINDEX / 2) + 1} /{" "}
                  {Math.floor(state.allData.length / 2)}
                </span>
              </div>
              <div className="col-span-3">
                <Amount loadItem={loadItem} />
              </div>
            </div>
          </form>
        </DialogArrow>
      </div>
    </>
  );
};

export default Modal;
