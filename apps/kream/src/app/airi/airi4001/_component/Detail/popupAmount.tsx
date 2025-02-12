"use client";

import { useRef, useEffect, useCallback } from "react";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { TextArea } from "components/input";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { useCommonStore, AmountInputOptions } from "../../_store/store";
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
  const detailIndex = useCommonStore(
    (state) => state.detailIndex,
    shallow
  );



  const Closing ='2'
  const popup = useCommonStore((state) => state.popup);
  const actions = useCommonStore((state) => state.actions);
  
 let total = 0

  const handleonChange = useCallback(
    (e: any) => {
      log("e", detailSelectedRow?.[detailIndex].other_3 - detailSelectedRow_AB?.other_3);
      
    },
    [detailSelectedRow, detailSelectedRow_AB]
  );

  useEffect(() => {
    console.log("Count changed:", detailSelectedRow?.[detailIndex]?.state );
    console.log("Count changed:", Closing );
  }, [detailSelectedRow]);



  // const handleMaskedInputChange = useCallback(
  //   (e: any, selectedRow: any, setSelectedRow: (row: any) => void) => {
  //     const sanitizedValue =
  //       typeof e.target.value === "string"
  //         ? e.target.value.replace(/,/g, "")
  //         : e.target.value;

  //     const numericValue = Number(sanitizedValue);

  //     if (isNaN(numericValue)) {
  //       // console.warn("Invalid numeric input:", e.target.value);
  //       return;
  //     }

  //     const vatKey = `${e.target.id}_vat`;
  //     const vatValue = Math.floor(numericValue * 0.1);

  //     const updatedRow = {
  //       ...selectedRow,
  //       [e.target.id]: numericValue,
  //       [vatKey]: vatValue,
  //       __changed: true,
  //     };

  //      total = Object.entries(selectedRow)
  //     .filter(([key, value]) => !key.endsWith('_vat')) // '_vat'로 끝나는 키 제외
  //     .reduce((sum, [key, value]) => sum + (Number(value) || 0), 0);
    

  //     setSelectedRow(updatedRow);

  //    // detailSelectedRow_AB 업데이트 로직 추가
  //   let updatedDetailSelectedRow_AB = { ...detailSelectedRow_AB };

  //   if (e.target.id === "customs_duty") {
  //     updatedDetailSelectedRow_AB = {
  //       ...updatedDetailSelectedRow_AB,
  //       customs_duty_ab: numericValue,
  //     };
  //   } else if (e.target.id === "customs_tax") {
  //     updatedDetailSelectedRow_AB = {
  //       ...updatedDetailSelectedRow_AB,
  //       customs_tax_ab: numericValue,
  //     };
  //   }
  //   },
  //   []
  // );

  const handleMaskedInputChange = useCallback(
    (e: any, selectedRows: Record<string, any> | null, setSelectedRows: (rows: any[]) => void) => {
      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;
  
      const numericValue = Number(sanitizedValue);            
      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.floor(numericValue * 0.1);

      if (!selectedRows || !detailSelectedRow || !detailSelectedRow_AB || isNaN(numericValue)) {
        return;
      }
      log('detailSelectedRow', detailSelectedRow, detailIndex, numericValue, e.target.id)

    // 🔹 기존 객체를 복사하고, 특정 detailIndex의 값만 업데이트
    const updatedDetailSelectedRow = {
      ...detailSelectedRow,
      [detailIndex]: {
        ...detailSelectedRow[detailIndex], // 기존 row 유지
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      },
    };

    // 🔹 기존 객체를 복사하고, 특정 detailIndex의 값만 업데이트
    const updatedDetailSelectedRow_AB = {
      ...detailSelectedRow_AB,
      [detailIndex]: {
        ...detailSelectedRow_AB[detailIndex], // 기존 row 유지
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      },
    };

    actions.setDetailRVDatas(updatedDetailSelectedRow)
    actions.setDetailABDatas(updatedDetailSelectedRow_AB)
      // 총합 계산
      // const total = updatedRows
      //   .map(row :any =>
      //     Object.entries(row)
      //       .filter(([key]) => !key.endsWith("_vat"))
      //       .reduce((sum, [, value]) => sum + (Number(value) || 0), 0)
      //   )
      //   .reduce((acc, rowTotal) => acc + rowTotal, 0);
  
      // setSelectedRows(updatedRows);
  
      // 🔹 detailSelectedRow_AB 업데이트 (배열 형태로 변경)
      // const updatedDetailSelectedRow_AB = detailSelectedRow_AB.map((row :any, index:any) =>
      //   index === detailIndex
      //     ? {
      //         ...row,
      //         ...(e.target.id === "customs_duty" && { customs_duty_ab: numericValue }),
      //         ...(e.target.id === "customs_tax" && { customs_tax_ab: numericValue }),
      //       }
      //     : row
      // );
  
      // actions.setDetailSelectedRow_AB(updatedDetailSelectedRow_AB);
    },
    [detailIndex, detailSelectedRow, detailSelectedRow_AB] // 의존성 배열 추가
  );
  

  return (
    <>
      <div className="w-full flex-col min-h-[30vh] p-2">
        <div className="flex w-full h-full">
          <div className="flex flex-col w-4/5 h-full gap-1 p-1 border rounded-lg">
            {/* Title Row */}
            <div
              className="grid justify-center mb-2"
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
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
              {/* <DTDLabel2 id="remark" name="REMARK" lwidth="40" backgroundColor="blue"/> */}
            </div>
            {/* 관세 */}
            <div
              className="grid h-8 gap-1"
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="customs_duty" name="l_customs_duty" />
              <MaskedInputField
                id="customs_duty"
                value={detailSelectedRow?.[detailIndex]?.customs_duty}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
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
                value={detailSelectedRow?.[detailIndex]?.customs_duty_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="customs_duty_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].customs_duty) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].customs_duty_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>

            {/* 부가세 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
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
              />
              <MaskedInputField
                id="customs_tax"
                value={detailSelectedRow?.[detailIndex].customs_tax}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="customs_tax_ab"
                value={detailSelectedRow_AB?.[detailIndex].customs_tax_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="customs_tax_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].customs_tax) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].customs_tax_cost) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>

            {/* 창고료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="bonded_wh" name="l_bonded_wh" />
              <MaskedInputField
                id="bonded_wh"
                value={detailSelectedRow?.[detailIndex].bonded_wh}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="bonded_wh_vat"
                value={detailSelectedRow?.[detailIndex].bonded_wh_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="bonded_wh_ab"
                value={detailSelectedRow_AB?.[detailIndex].bonded_wh_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="bonded_wh_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].bonded_wh) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].bonded_wh_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>
            {/* 파출수수료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="dispatch_fee" name="l_dispatch_fee" />
              <MaskedInputField
                id="dispatch_fee"
                value={detailSelectedRow?.[detailIndex].dispatch_fee}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="dispatch_fee_vat"
                value={detailSelectedRow?.[detailIndex].dispatch_fee_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="dispatch_fee_ab"
                value={detailSelectedRow_AB?.[detailIndex].dispatch_fee_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="dispatch_fee_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].dispatch_fee) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].dispatch_fee_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: handleMaskedInputChange,
                // }}
              />
            </div>

            {/* 통관수수료(대납) */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="customs_clearance" name="l_customs_clearance" />
              <MaskedInputField
                id="customs_clearance"
                value={detailSelectedRow?.[detailIndex].customs_clearance}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="customs_clearance_vat"
                value={detailSelectedRow?.[detailIndex].customs_clearance_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="customs_clearance_ab"
                value={detailSelectedRow_AB?.[detailIndex].customs_clearance_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="customs_clearance_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].customs_clearance) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].customs_clearance_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: handleMaskedInputChange,
                // }}
              />
            </div>

            {/* K/수수료- 업무대행수수료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="dtd_handling" name="l_dtd_handling" />
              <MaskedInputField
                id="dtd_handling"
                value={detailSelectedRow?.[detailIndex].dtd_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="dtd_handling_vat"
                value={detailSelectedRow?.[detailIndex].dtd_handling_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="dtd_handling_ab"
                value={detailSelectedRow_AB?.[detailIndex].dtd_handling_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="dtd_handling_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].dtd_handling) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].dtd_handling_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: handleMaskedInputChange,
                // }}
              />
            </div>

            {/* 특별통관수수료 */}
            <div
              className="grid h-8 gap-1"
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="special_handling" name="l_special_handling" />
              <MaskedInputField
                id="special_handling"
                value={detailSelectedRow?.[detailIndex].special_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="special_handling_vat"
                value={detailSelectedRow?.[detailIndex].special_handling_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="special_handling_ab"
                value={detailSelectedRow_AB?.[detailIndex].special_handling_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="special_handling_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].special_handling) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].special_handling_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: handleMaskedInputChange,
                // }}
              />
            </div>

            {/* 운송료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="trucking" name="l_trucking" />
              <MaskedInputField
                id="trucking"
                value={detailSelectedRow?.[detailIndex].trucking}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="trucking_vat"
                value={detailSelectedRow?.[detailIndex].trucking_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="trucking_ab"
                value={detailSelectedRow_AB?.[detailIndex].trucking_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="trucking_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].trucking) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].trucking_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: handleMaskedInputChange,
                // }}
              />
            </div>

            {/* 항공운임료(항공료) */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="air_freight" name="l_air_freight" />
              <MaskedInputField
                id="air_freight"
                value={detailSelectedRow?.[detailIndex].air_freight}
                options={{
                  ...AmountInputOptions,
                  isReadOnly:detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id=""
                value=""
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-300",
                  isReadOnly:  true,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="air_freight_ab"
                value={detailSelectedRow_AB?.[detailIndex].air_freight_ab}
                options={{
                  ...AmountInputOptions,
                  bgColor: "black",
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="air_freight_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].air_freight) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].air_freight_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>

            {/* H/C 항공수수료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="bl_handling" name="l_bl_handling" />
              <MaskedInputField
                id="bl_handling"
                value={detailSelectedRow?.[detailIndex].bl_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />

              <MaskedInputField
                id="bl_handling_vat"
                value={detailSelectedRow?.[detailIndex].bl_handling_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="bl_handling_ab"
                value={detailSelectedRow_AB?.[detailIndex].bl_handling_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="bl_handling_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].bl_handling) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].bl_handling_ab) || 0)}`}
                options={{                  
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>

            {/* 보험료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="insurance_fee" name="insurance_fee" />
              <MaskedInputField
                id="insurance_fee"
                value={detailSelectedRow?.[detailIndex].insurance_fee}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="insurance_fee_vat"
                value={detailSelectedRow?.[detailIndex].insurance_fee_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly:detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="insurance_fee_ab"
                value={detailSelectedRow_AB?.[detailIndex].insurance_fee_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="insurance_fee_profit"
                value={`${(Number(detailSelectedRow?.[detailIndex].insurance_fee) || 0) - (Number(detailSelectedRow_AB?.[detailIndex].insurance_fee_ab) || 0)}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>

            {/* 기타수수료(OTHER_1) */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="other_1" name="other_1" />
              <MaskedInputField
                id="other_1"
                value={detailSelectedRow?.[detailIndex].other_1}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="other_1_vat"
                value={detailSelectedRow?.[detailIndex].other_1_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="other_1_ab"
                value={detailSelectedRow_AB?.[detailIndex].other_1_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly:detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="other_1_profit"
                value={`${detailSelectedRow?.[detailIndex].other_1 - detailSelectedRow_AB?.[detailIndex].other_1_ab}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>
            {/* 기타1 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="other_2" name="other_2" />
              <MaskedInputField
                id="other_2"
                value={detailSelectedRow?.[detailIndex].other_2}
                options={{
                  ...AmountInputOptions,
                  isReadOnly:detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="other_2_vat"
                value={detailSelectedRow?.[detailIndex].other_2_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow,
                      actions.setDetailSelectedRow
                    ),
                }}
              />
              <MaskedInputField
                id="other_2_ab"
                value={detailSelectedRow_AB?.[detailIndex].other_2_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly:detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
                events={{
                  onChange: (e) =>
                    handleMaskedInputChange(
                      e,
                      detailSelectedRow_AB,
                      actions.setDetailSelectedRow_AB
                    ),
                }}
              />
              <MaskedInputField
                id="other_2_profit"
                value={`${detailSelectedRow?.[detailIndex].other_2 - detailSelectedRow_AB?.[detailIndex].other_2_ab}`}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
                // events={{
                //   onChange: (e) => handleMaskedInputChange(e, detailSelectedRow, actions.setDetailSelectedRow),
                // }}
              />
            </div>


            {/* 합계 */}
            <div
              className="grid h-8 gap-1"
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="total" name="total" />
              <MaskedInputField
                id="total"
                value={total.toString()}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
              />
              <MaskedInputField
                id="total_vat"
                value={detailSelectedRow?.[detailIndex].total_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
              />
              <MaskedInputField
                id="total_cost"
                value={detailSelectedRow?.[detailIndex].total_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: detailSelectedRow?.[detailIndex]?.state === Closing ? true : false,
                }}
              />
              <MaskedInputField
                id="total_profit"
                value={detailSelectedRow?.[detailIndex].total_profit}
                options={{
                  ...AmountInputOptions,
                  bgColor: "!bg-gray-200",
                  isReadOnly: true,
                  allowNegative: true,
                }}
              />
            </div>
            {/* <DTDLabel id="총합계" name="총합계" lwidth="40" /> */}
          </div>
          <div className="flex flex-col w-1/5 h-full p-1 ">
            <TextArea
              id="remark"
              rows={22}
              cols={32}
              value={detailSelectedRow?.[detailIndex].remark}
              options={{ isReadOnly: false }}
              events={{
                onChange: handleonChange,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Amount;
