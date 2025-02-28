"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { TextArea } from "components/input";
import { MaskedInputField } from "@/components/input/react-text-mask";
import {
  useCommonStore,
  AmountInputOptions,
  sumFields,
  sumVatFields,
  sumCostFields,
  profitFields,
} from "../../_store/store";
import { shallow } from "zustand/shallow";

import { DTDLabel, DTDLabel2 } from "@/components/label/index";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const Amount: React.FC<Props> = ({ loadItem, params }) => {
  const detailSelectedRow = useCommonStore(
    (state) => state.detailRVDatas,
    shallow
  );
  const detailSelectedRow_AB = useCommonStore(
    (state) => state.detailABDatas,
    shallow
  );
  const detailIndex = useCommonStore((state) => state.detailIndex, shallow);
  const formatValue = (value: string | undefined) =>
    value === "0" ? "" : value;
  const Closing = "2";
  const actions = useCommonStore((state) => state.actions);
  const [index, setIndex] = useState(0);

  const handleMaskedInputChange = useCallback(
    (
      e: any,
      selectedRows: Record<string, any> | null,
      setSelectedRows: (rows: any[]) => void
    ) => {
      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;
  
      const numericValue = Number(sanitizedValue);
      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.floor(numericValue * 0.1);
  
      if (
        !selectedRows ||
        !detailSelectedRow ||
        !detailSelectedRow_AB ||
        isNaN(numericValue)
      ) {
        return;
      }
  
      // 기존 값 가져오기 (없는 경우 기본값 설정)
      const prevRow = detailSelectedRow[detailIndex] || {};
      const prevRow_AB = detailSelectedRow_AB[detailIndex] || {};
  
      // 🔹 원금과 VAT를 먼저 적용
      const updatedRow = {
        ...prevRow,
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
      };
  
      const updatedRow_AB = {
        ...prevRow_AB,
        [e.target.id]: numericValue,
      };
  
      // 🔹 sumFields에 포함된 필드만 합산 (e.target.id 포함)
      const totalAmt = sumFields.reduce((acc, field) => {
        const value = parseFloat(
          field === e.target.id ? numericValue : updatedRow[field]
        ) || 0;
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
  
      // 🔹 sumVatFields에 포함된 필드만 합산 (e.target.id 포함)
      const totalVat = sumVatFields.reduce((acc, field) => {
        const value = parseFloat(
          field === e.target.id ? vatValue : updatedRow[field]
        ) || 0;
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
  
      // 🔹 sumCostFields에 포함된 필드만 합산 (e.target.id 포함)
      const totalCost = sumCostFields.reduce((acc, field) => {
        const value = parseFloat(
          field === e.target.id ? numericValue : updatedRow_AB[field]
        ) || 0;
        return acc + (isNaN(value) ? 0 : value);
      }, 0);
  
      // 🔹 최종 업데이트
      const updatedDetailSelectedRow = {
        ...detailSelectedRow,
        [detailIndex]: {
          ...updatedRow,
          total_amt: totalAmt,
          total_vat: totalVat,
          total_tot: totalAmt + totalVat,
          __changed: true,
        },
      };
  
      const updatedDetailSelectedRow_AB = {
        ...detailSelectedRow_AB,
        [detailIndex]: {
          ...updatedRow_AB,
          total_cost: totalCost,
          __changed: true,
        },
      };
  
      actions.setDetailRVDatas(updatedDetailSelectedRow);
      actions.setDetailABDatas(updatedDetailSelectedRow_AB);
    },
    [detailIndex, detailSelectedRow, detailSelectedRow_AB]
  );  

  const [profitValues, setProfitValues] = useState<Record<string, number>>({});

  //profit계산
  useEffect(() => {
    const updatedProfitValues = sumFields.reduce(
      (acc, field) => {
        const Field = `${field}`;
        const costField = `${field}_ab`;
        const profitValue =
          (Number(detailSelectedRow?.[detailIndex]?.[field]) || 0) -
          (Number(detailSelectedRow_AB?.[detailIndex]?.[costField]) || 0);

        acc[`${Field}_profit`] = profitValue;
        return acc;
      },
      {} as { [key: string]: number }
    );

    setProfitValues(updatedProfitValues);
  }, [detailSelectedRow, detailSelectedRow_AB, detailIndex, profitFields]);

  const totalProfit = useMemo(() => {
    const profit = profitFields.reduce((acc, field) => {
      const profitField = `${field}`;
      const value = profitValues[profitField] || 0;
      return acc + value;
    }, 0);

    return profit;
  }, [profitValues, profitFields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    log("value", value, e.target.id);

    if (!detailSelectedRow || !detailSelectedRow_AB) {
      return;
    }

    const prevRow = detailSelectedRow[detailIndex] || {};

    const updatedDetailSelectedRow = {
      ...detailSelectedRow,
      [detailIndex]: {
        ...prevRow,
        [e.target.id]: value,
        __changed: true,
      },
    };

    actions.setDetailRVDatas(updatedDetailSelectedRow);
  };

  const handleKeyDown = (e: any, index: number) => {
    const form = e.target.form.elements;
    var currentIndex = Array.prototype.indexOf.call(form, e.target);
    if (e.key === "Tab") {
      e.preventDefault();
      // 필드셋과 버튼은 포커스 제외
      while (
        form[currentIndex + 1] instanceof HTMLButtonElement ||
        form[currentIndex + 1] instanceof HTMLFieldSetElement ||
        form[currentIndex + 1].readOnly === true
      )
        currentIndex++;
      if (form[currentIndex + 1]) {
        form[currentIndex + 1].focus();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (form[currentIndex + 5]) {
        form[currentIndex + 5].focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (form[currentIndex - 5]) {
        form[currentIndex - 5].focus();
      }
    }
  };

  return (
    <>
      <form>
        <div className="w-full flex-col min-h-[30vh] p-2">
          <div className="flex w-full h-full">
            <div className="flex flex-col w-full h-full gap-1 p-1 border rounded-lg">
              {/* Title Row */}
              <div
                className="grid justify-center mb-2"
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel2 id="" name="" lwidth="20" backgroundColor="white" />
                <DTDLabel2
                  id="amount"
                  name="AMOUNT"
                  lwidth="30"
                  backgroundColor="gray"
                />
                <DTDLabel2
                  id="vat"
                  name="VAT"
                  lwidth="30"
                  backgroundColor="red"
                />
                <DTDLabel2
                  id="cost"
                  name="COST"
                  lwidth="30"
                  backgroundColor="yellow"
                />

                <DTDLabel2
                  id="profit"
                  name="PROFIT"
                  lwidth="30"
                  backgroundColor="blue"
                />
                <DTDLabel2
                  id="remark"
                  name="REMARK"
                  lwidth="30"
                  backgroundColor="gray"
                />
              </div>
              {/* 관세 */}
              <div
                className="grid h-8 gap-1"
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="customs_duty" name="l_customs_duty" />
                <MaskedInputField
                  id="customs_duty"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.customs_duty
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                    // onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id=""
                  value=""
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-300",
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="customs_duty_ab"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.customs_duty
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="customs_duty_profit"
                  value={"0"}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="customs_duty_remark"
                  value={detailSelectedRow?.[detailIndex]?.customs_duty_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base",
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 부가세 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="customs_tax" name="l_customs_tax" />
                <MaskedInputField
                  id=""
                  value=""
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-300",
                    isReadOnly: true,
                  }}
                  events={{
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="customs_tax"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.customs_tax
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="customs_tax_ab"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.customs_tax
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="customs_tax_profit"
                  value={`0`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="customs_tax_remark"
                  value={detailSelectedRow?.[detailIndex]?.customs_tax_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base",
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 창고료 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="bonded_wh" name="l_bonded_wh" />
                <MaskedInputField
                  id="bonded_wh"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.bonded_wh
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                      bgColor :  detailSelectedRow?.[detailIndex]?.loading_loc === "KWE" ? "!bg-yellow-100" : "",
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="bonded_wh_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.bonded_wh_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="bonded_wh_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.bonded_wh_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="bonded_wh_profit"
                  value={`${profitValues?.bonded_wh_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.bonded_wh_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="bonded_wh_remark"
                  value={detailSelectedRow?.[detailIndex]?.bonded_wh_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 파출수수료 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="dispatch_fee" name="l_dispatch_fee" />
                <MaskedInputField
                  id="dispatch_fee"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.dispatch_fee
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="dispatch_fee_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.dispatch_fee_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="dispatch_fee_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.dispatch_fee_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="dispatch_fee_profit"
                  value={`${profitValues?.dispatch_fee_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.dispatch_fee_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="dispatch_fee_remark"
                  value={detailSelectedRow?.[detailIndex]?.dispatch_fee_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 통관수수료(대납) */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="customs_clearance" name="l_customs_clearance" />
                <MaskedInputField
                  id="customs_clearance"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.customs_clearance
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="customs_clearance_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.customs_clearance_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="customs_clearance_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.customs_clearance_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="customs_clearance_profit"
                  value={`${profitValues?.customs_clearance_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.customs_clearance_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="customs_clearance_remark"
                  value={
                    detailSelectedRow?.[detailIndex]?.customs_clearance_remark
                  }
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* K/수수료- 업무대행수수료 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr  1fr  0.8fr 1fr" }}
              >
                <DTDLabel id="dtd_handling" name="l_dtd_handling" />
                <MaskedInputField
                  id="dtd_handling"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.dtd_handling
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="dtd_handling_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.dtd_handling_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="dtd_handling_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.dtd_handling_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="dtd_handling_profit"
                  value={`${profitValues?.dtd_handling_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.dtd_handling_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="dtd_handling_remark"
                  value={detailSelectedRow?.[detailIndex]?.dtd_handling_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 특별통관수수료 */}
              <div
                className="grid h-8 gap-1"
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="special_handling" name="l_special_handling" />
                <MaskedInputField
                  id="special_handling"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.special_handling
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="special_handling_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.special_handling_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="special_handling_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.special_handling_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ), onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="special_handling_profit"
                  value={`${profitValues?.special_handling_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.special_handling_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="special_handling_remark"
                  value={detailSelectedRow?.[detailIndex]?.dtd_handling_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 운송료 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="trucking" name="l_trucking" />
                <MaskedInputField
                  id="trucking"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.trucking
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                      bgColor :  detailSelectedRow?.[detailIndex]?.group_id !== null ? "!bg-blue-200" : "",
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="trucking_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.trucking_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="trucking_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.trucking_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="trucking_profit"
                  value={`${profitValues?.trucking_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.trucking_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="trucking_remark"
                  value={detailSelectedRow?.[detailIndex]?.trucking_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 항공운임료(항공료) */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="air_freight" name="l_air_freight" />
                <MaskedInputField
                  id="air_freight"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.air_freight
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                      bgColor :  detailSelectedRow?.[detailIndex]?.waybill_gubn === "T-타사BL" ? "!bg-red-200" : "",
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id=""
                  value=""
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-300",
                    isReadOnly: true,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="air_freight_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.air_freight_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "black",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="air_freight_profit"
                  value={`${profitValues?.air_freight_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.air_freight_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="air_freight_remark"
                  value={detailSelectedRow?.[detailIndex]?.air_freight_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* H/C 항공수수료 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="bl_handling" name="l_bl_handling" />
                <MaskedInputField
                  id="bl_handling"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.bl_handling
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="bl_handling_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.bl_handling_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="bl_handling_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.bl_handling_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="bl_handling_profit"
                  value={`${profitValues?.bl_handling_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.bl_handling_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="bl_handling_remark"
                  value={detailSelectedRow?.[detailIndex]?.bl_handling_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 보험료 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="insurance_fee" name="insurance_fee" />
                <MaskedInputField
                  id="insurance_fee"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.insurance_fee
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="insurance_fee_vat"
                  value={""}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-300",
                    isReadOnly: true,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="insurance_fee_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.insurance_fee_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="insurance_fee_profit"
                  value={`${profitValues?.insurance_fee_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.insurance_fee_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="insurance_fee_remark"
                  value={detailSelectedRow?.[detailIndex]?.insurance_fee_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 기타수수료(OTHER_1) */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="other_1" name="other_1" />
                <MaskedInputField
                  id="other_1"
                  value={formatValue(detailSelectedRow?.[detailIndex]?.other_1)}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="other_1_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.other_1_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="other_1_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.other_1_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="other_1_profit"
                  value={`${profitValues?.other_1_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.other_1_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="other_1_remark"
                  value={detailSelectedRow?.[detailIndex]?.other_1_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>
              {/* 기타1 */}
              <div
                className="grid h-8 gap-1 "
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="other_2" name="other_2" />
                <MaskedInputField
                  id="other_2"
                  value={formatValue(detailSelectedRow?.[detailIndex]?.other_2)}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="other_2_vat"
                  value={formatValue(
                    detailSelectedRow?.[detailIndex]?.other_2_vat
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow,
                        actions.setDetailRVDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
                <MaskedInputField
                  id="other_2_ab"
                  value={formatValue(
                    detailSelectedRow_AB?.[detailIndex]?.other_2_ab
                  )}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: (e) =>
                      handleMaskedInputChange(
                        e,
                        detailSelectedRow_AB,
                        actions.setDetailABDatas
                      ),
                      onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />

                <MaskedInputField
                  id="other_2_profit"
                  value={`${profitValues?.other_2_profit || 0}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : profitValues?.other_2_profit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="other_2_remark"
                  value={detailSelectedRow?.[detailIndex]?.other_2_remark}
                  options={{
                    noLabel: true,
                    disableSpacing: true,
                    fontSize: "base", //Font Size (xs, sm, base, lg, xl, 2xl......)
                    fontWeight: "bold",
                    isReadOnly:
                      detailSelectedRow?.[detailIndex]?.state === Closing,
                  }}
                  events={{
                    onChange: handleChange,
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                />
              </div>

              {/* 합계 */}
              <div
                className="grid h-8 gap-1"
                style={{ gridTemplateColumns: "1.2fr 1fr 1fr 1fr 0.8fr 1fr" }}
              >
                <DTDLabel id="total" name="total" />
                <MaskedInputField
                  id="total_amt"
                  value={detailSelectedRow?.[detailIndex]?.total_amt}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="total_vat"
                  value={detailSelectedRow?.[detailIndex]?.total_vat}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="total_cost"
                  value={detailSelectedRow_AB?.[detailIndex]?.total_cost}
                  options={{
                    ...AmountInputOptions,
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="total_profit"
                  value={`${totalProfit}`}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-gray-200",
                    textColor : totalProfit < 0 ? "red" : "black",
                    isReadOnly: true,
                    allowNegative: true,
                  }}
                />
                <MaskedInputField
                  id="total_tot"
                  value={detailSelectedRow?.[detailIndex]?.total_tot}
                  options={{
                    ...AmountInputOptions,
                    bgColor: "!bg-sky-200",
                    isReadOnly: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Amount;
