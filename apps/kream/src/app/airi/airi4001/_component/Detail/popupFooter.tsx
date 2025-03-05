"use client";

import { useState, useEffect, useCallback, MouseEventHandler } from "react";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { useCommonStore } from "../../_store/store";
import { useFormContext } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { DatePicker } from "@/components/date/react-datepicker";
import { Button } from "components/button";
import { toastError, toastSuccess } from "components/toast";
import { gridData } from "components/grid/ag-grid-enterprise";
import ResizableLayout from "../../../../stnd/stnd0016/_component/DetailInfo/Layout/ResizableLayout";
import CustomSelect from "components/select/customSelect";
import { Label } from 'components/label';
import dayjs from "dayjs";
import { MdSignalCellularNodata } from "react-icons/md";
const { log } = require("@repo/kwe-lib/components/logHelper");
type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const Balance: React.FC<Props> = ({ loadItem, params }) => {
  const { getValues } = useFormContext();
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const detailRVDatas = useCommonStore((state) => state.detailRVDatas);
  const detailABDatas = useCommonStore((state) => state.detailABDatas);
  const detailIndex = useCommonStore((state) => state.detailIndex);
  const searchParams = useCommonStore((state) => state.searchParams);
  
  const [isAdding, setIsAdding] = useState(false);  
  const [transactioncategory, setTransactioncategory] = useState<any>();
  useEffect(() => {
    if (loadItem?.length) {
      setTransactioncategory(loadItem[10]);
    }
  }, [loadItem]);

  const onAdd = async (param: MouseEventHandler | null) => {
    setIsAdding(true);
  };
  
  const onSave = async (param: MouseEventHandler | null) => {
    if (!detailRVDatas) return;
    if (!detailABDatas) return;
    const result = await  actions.saveFinancialRecord(getValues());
    if(result){        
      toastSuccess("success")
      const filteredWaybills: { waybill_no: string; seq: number }[] = [];
      const waybillSet = new Set();
      state.allData.forEach((row, index) => {
        const key = `${row.waybill_no}_${row.seq}`;

        if (index % 1 === 0 && !waybillSet.has(key)) {
          waybillSet.add(key);
          filteredWaybills.push({ waybill_no: row.waybill_no, seq: row.seq });
        }
      });
      actions.getDomesticDetailDatas({
        jsondata: JSON.stringify(filteredWaybills),
      });
    }
    setIsAdding(false); 
  };
  
  const handleonSelectionChanged = (e: any, id: any, value: any) => {
    if (!e) return;
    actions.updateDetailRVField(detailRVDatas, detailIndex, id, value);
  };

  return (
    <>
      <div className="flex w-full space-x-4">
        <ResizableLayout
          defaultLeftWidth={800}
          minLeftWidth={500}
          maxLeftWidth={1200}
          defaultHeight={250}
          minHeight={100}
          maxHeight={900}
          ratio={60}
          leftContent={
            <div className="flex-col justify-start p-2 mb-4">
              {!isAdding ? (
                <Button id={"add"} onClick={onAdd} width="w-32" />
              ) : (
                <>
                  <DatePicker
                    id="transaction_date"
                    value={dayjs().subtract(0, "days").startOf("days").format("YYYYMMDD")}
                    width="w-full"
                    options={{
                      inline: true,
                      textAlign: "center",
                      freeStyles: "border-1 border-slate-300",
                    }}
                  />
                  <MaskedInputField
                    id="transaction_amount"
                    value={detailRVDatas?.[detailIndex]?.transaction_amount || ""}
                    options={{
                      inline: true,
                      textAlign: "right",
                      type: "number",
                    }}
                  />
                  <CustomSelect
                      id="transaction_category"
                      listItem={transactioncategory as gridData}
                      valueCol={["transaction_category"]}
                      displayCol="transaction_category_nm"
                      gridOption={{
                        colVisible: {
                          col: ["transaction_category", "transaction_category_nm"],
                          visible: true,
                        },
                      }}
                      events={{
                        onSelectionChanged: handleonSelectionChanged,
                      }}
                      gridStyle={{ width: "600px", height: "150px" }}
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
                                
                  <MaskedInputField
                    id="transaction_remark"
                    value={detailRVDatas?.[detailIndex]?.transaction_remark || ""}
                    options={{
                      inline : true,
                      isReadOnly: false,
                    }}
                  />
                   <Button id={"save"} onClick={onSave} width="w-32" />
                </>
              )}
            </div>
          }
          rightContent={<>
            <fieldset className="w-full p-1 ml-auto border border-gray-300 rounded-lg">
              <legend className="px-2 text-sm font-semibold text-gray-600">
                Info
              </legend>
              <h5 className="px-2 mt-1 text-xs italic text-gray-500">
                ⏩ 더블클릭:{" "}
                <span className="font-medium text-gray-700">
                  업체거래내역 메뉴로 이동
                </span>
              </h5>

              {/* Date Pickers Section */}
              <div className="grid grid-cols-2 gap-1 mb-4">
                <DatePicker 
                  id="insert_date"
                  label="insert"
                  value={detailRVDatas?.[detailIndex]?.insert_date || ""}
                  options={{
                    inline: true,
                    textAlign: "center",
                    freeStyles: "border-1 border-slate-300",
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="insert_amount"
                  value={detailRVDatas?.[detailIndex]?.insert_amount || ""}
                  width="w-40"
                  options={{
                    inline: true,
                    noLabel: true,
                    isReadOnly: true,
                    textAlign: "center",
                    type: "number",
                  }}
                />


                <DatePicker
                  id="refund_date"
                  label="refund"
                  value={detailRVDatas?.[detailIndex]?.refund_date || ""}
                  options={{
                    inline: true,
                    textAlign: "center",
                    freeStyles: "border-1 border-slate-300",
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="refund_amount"
                  value={detailRVDatas?.[detailIndex]?.refund_amount || ""}
                  width="w-40"
                  options={{
                    inline: true,
                    noLabel: true,
                    isReadOnly: true,
                    textAlign: "center",
                    type: "number",
                  }}
                />

                <DatePicker
                  id="adjust_date"
                  value={detailRVDatas?.[detailIndex]?.adjust_date || ""}
                  options={{
                    inline: true,
                    textAlign: "center",
                    freeStyles: "border-1 border-slate-300",
                    isReadOnly: true,
                  }}
                />

                <MaskedInputField
                  id="adjust_amount"
                  value={detailRVDatas?.[detailIndex]?.adjust_amount || ""}
                  width="w-40"
                  options={{
                    inline: true,
                    noLabel: true,
                    isReadOnly: true,
                    textAlign: "center",
                    type: "number",
                  }}
                />
              <Label id="tot_amount" isDisplay={true}/>{"tot_amount_tot_amount"}
              </div>
            </fieldset>
            </>
          }
        />
      </div>
    </>
  );
};

export default Balance;
