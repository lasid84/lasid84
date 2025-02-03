"use client";

import { useRef, useEffect,useCallback } from "react";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { TextArea } from "components/input";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { useCommonStore, AmountInputOptions } from "../../_store/store";
import { shallow } from 'zustand/shallow';

import { DTDLabel, DTDLabel2 } from "@/components/label/index";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const Amount: React.FC<Props> = ({ loadItem, params }) => {
  const detailSelectedRow = useCommonStore((state) => state.detailSelectedRow , shallow);
  const popup = useCommonStore((state) => state.popup);
  const actions = useCommonStore((state) => state.actions);

const handleonChange = useCallback((e:any)=>{
  log('e',e)
},[detailSelectedRow])

  const handleMaskedInputChange = useCallback(
    (e: any) => {

      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;

      const numericValue = Number(sanitizedValue);

      if (isNaN(numericValue)) {
        console.warn("Invalid numeric input:", e.target.value);
        return;
      }

      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.floor(numericValue * 0.1);

      const updatedRow = {
        ...detailSelectedRow,
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      };
      actions.setDetailSelectedRow(updatedRow);

    },
    [detailSelectedRow]
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
                id="customs_duty_rv"
                value={detailSelectedRow?.customs_duty_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id=""
                value=""
                options={{
                  ...AmountInputOptions,
                  bgColor:"!bg-gray-300",
                  isReadOnly: true,
                }}                
              />
              <MaskedInputField
                id="customs_duty_ab"
                value={detailSelectedRow?.customs_duty_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="customs_duty_profit"
                value={`${detailSelectedRow?.customs_duty_rv - detailSelectedRow?.customs_duty_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
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
                  bgColor:"!bg-gray-300",
                  isReadOnly: true,
                }}
              />
              <MaskedInputField
                id="customs_tax"
                value={detailSelectedRow?.customs_tax_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="customs_tax_ab"
                value={detailSelectedRow?.customs_tax_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="customs_tax_profit"
                value={`${detailSelectedRow?.customs_duty_rv - detailSelectedRow?.customs_duty_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* 창고료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="bonded_wh" name="l_bonded_wh" />
              <MaskedInputField
                id="bonded_wh_rv"
                value={detailSelectedRow?.bonded_wh_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="bonded_wh_vat_rv"
                value={detailSelectedRow?.bonded_wh_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="bonded_wh_ab"
                value={detailSelectedRow?.bonded_wh_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="bonded_wh_profit"
                value={`${detailSelectedRow?.bonded_wh_rv - detailSelectedRow?.bonded_wh_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>
            {/* 파출수수료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="dispatch_fee" name="l_dispatch_fee" />
              <MaskedInputField
                id="dispatch_fee_rv"
                value={detailSelectedRow?.dispatch_fee_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="dispatch_fee_vat_rv"
                value={detailSelectedRow?.dispatch_fee_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="dispatch_fee_ab"
                value={detailSelectedRow?.dispatch_fee_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="dispatch_fee_profit"
                value={`${detailSelectedRow?.dispatch_fee_rv - detailSelectedRow?.dispatch_fee_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* 통관료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="customs_clearance" name="l_customs_clearance" />
              <MaskedInputField
                id="customs_clearance_rv"
                value={detailSelectedRow?.customs_clearance_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="customs_clearance_vat_rv"
                value={detailSelectedRow?.customs_clearance_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="customs_clearance_ab"
                value={detailSelectedRow?.customs_clearance_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="customs_clearance_profit"
                value={`${detailSelectedRow?.customs_clearance_rv - detailSelectedRow?.customs_clearance_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* K/수수료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="dtd_handling" name="l_dtd_handling" />
              <MaskedInputField
                id="dtd_handling_rv"
                value={detailSelectedRow?.dtd_handling_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="dtd_handling_vat_rv"
                value={detailSelectedRow?.dtd_handling_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="dtd_handling_ab"
                value={detailSelectedRow?.dtd_handling_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="dtd_handling_profit"
                value={`${detailSelectedRow?.dtd_handling_rv - detailSelectedRow?.dtd_handling_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* K/수수료 */}
            <div
              className="grid h-8 gap-1"
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="special_handling" name="l_special_handling" />
              <MaskedInputField
                id="special_handling_rv"
                value={detailSelectedRow?.special_handling_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="special_handling_vat_rv"
                value={detailSelectedRow?.special_handling_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="special_handling_ab"
                value={detailSelectedRow?.special_handling_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="special_handling_profit"
                value={`${detailSelectedRow?.special_handling_rv-detailSelectedRow?.special_handling_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* 운송료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="trucking" name="l_trucking" />
              <MaskedInputField
                id="trucking_rv"
                value={detailSelectedRow?.trucking_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="trucking_vat_rv"
                value={detailSelectedRow?.trucking_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="trucking_ab"
                value={detailSelectedRow?.trucking_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="trucking_profit"
                value={`${detailSelectedRow?.trucking_rv-detailSelectedRow?.trucking_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* 항공료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="air_freight" name="l_air_freight" />
              <MaskedInputField
                id="air_freight_rv"
                value={detailSelectedRow?.air_freight_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id=''
                value=''
                options={{
                  ...AmountInputOptions,
                  bgColor:"!bg-gray-300",
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="air_freight_cost"
                value={detailSelectedRow?.air_freight_ab}
                options={{
                  ...AmountInputOptions,
                  bgColor : "black",
                  isReadOnly:true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="air_freight_profit"
                value={`${detailSelectedRow?.air_freight_rv-detailSelectedRow?.air_freight_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* H/C 항공수수료 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="bl_handling" name="l_bl_handling" />
              <MaskedInputField
                id="bl_handling_rv"
                value={detailSelectedRow?.bl_handling_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />

              <MaskedInputField
                id="bl_handling_vat_rv"
                value={detailSelectedRow?.bl_handling_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="bl_handling_ab"
                value={detailSelectedRow?.bl_handling_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="bl_handling_profit"
                value={(
                  Number(
                    detailSelectedRow?.bl_handling?.replace(/,/g, "") || 0
                  ) -
                  Number(
                    detailSelectedRow?.bl_handling_vat?.replace(/,/g, "") || 0
                  )
                ).toLocaleString()}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>

            {/* 보험료(OTHER_1) */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="other_1" name="other_1" />
              <MaskedInputField
                id="other_1_rv"
                value={detailSelectedRow?.other_1_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_1_vat_rv"
                value={detailSelectedRow?.other_1_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_1_ab"
                value={detailSelectedRow?.other_1_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_1_profit"
                value={`${detailSelectedRow?.other_1_rv-detailSelectedRow?.other_1_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>
            {/* 기타1 */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="other_2" name="other_2" />
              <MaskedInputField
                id="other_2_rv"
                value={detailSelectedRow?.other_2_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_2_vat_rv"
                value={detailSelectedRow?.other_2_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_2_ab"
                value={detailSelectedRow?.other_2_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_2_profit"
                value={`${detailSelectedRow?.other_2_rv-detailSelectedRow?.other_2_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
            </div>
            {/* OTHER_3(THC) */}
            <div
              className="grid h-8 gap-1 "
              style={{ gridTemplateColumns: "1.2fr repeat(4, 1fr)" }}
            >
              <DTDLabel id="other_3" name="other_3" />
              <MaskedInputField
                id="other_3_rv"
                value={detailSelectedRow?.other_3_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_3_vat_rv"
                value={detailSelectedRow?.other_3_vat_rv}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_3_ab"
                value={detailSelectedRow?.other_3_ab}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
              />
              <MaskedInputField
                id="other_3_profit"
                value={`${detailSelectedRow?.other_3_rv-detailSelectedRow?.other_3_ab}`}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
                events={{
                  onChange: handleMaskedInputChange,
                }}
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
                value={detailSelectedRow?.total}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="total_vat"
                value={detailSelectedRow?.total_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="total_cost"
                value={detailSelectedRow?.total_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="total_profit"
                value={detailSelectedRow?.total_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
              value={detailSelectedRow?.remark}
              options={{ isReadOnly: false }}
              events={{
                onChange:handleonChange
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Amount;
