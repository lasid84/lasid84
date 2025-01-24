"use client";

import { useRef, useEffect } from "react";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { TextArea } from "components/input";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { useCommonStore, AmountInputOptions } from "../../_store/store";
import { DTDLabel, DTDLabel2 } from "@/components/label/index";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const Amount: React.FC<Props> = ({ loadItem, params }) => {
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const popup = useCommonStore((state) => state.popup);
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);

  return (
    <>
      <div className="w-full flex-col min-h-[30vh] p-2">
        <div className="flex w-full h-full">
          <div className="flex flex-col w-4/5 h-full gap-1 p-1 p-2 border rounded-lg">
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
                value={mainSelectedRow?.customs_duty}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id=""
                value=""
                options={{
                  ...AmountInputOptions,
                  bgColor: "transparent",
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="customs_duty_cost"
                value={mainSelectedRow?.customs_duty}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="customs_duty_profit"
                value={mainSelectedRow?.customs_duty_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="customs_tax"
                value={mainSelectedRow?.customs_tax}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
                }}
              />
              <MaskedInputField
                id=""
                value=""
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
                }}
              />
              <MaskedInputField
                id="customs_tax_cost"
                value={mainSelectedRow?.customs_tax}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="customs_tax_profit"
                value={mainSelectedRow?.customs_tax_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="bonded_wh"
                value={mainSelectedRow?.bonded_wh}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="bonded_wh_vat"
                value={mainSelectedRow?.bonded_wh_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="bonded_wh_cost"
                value={mainSelectedRow?.bonded_wh}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="bonded_wh_profit"
                value={mainSelectedRow?.bonded_wh_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="dispatch_fee"
                value={mainSelectedRow?.dispatch_fee}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="dispatch_fee_vat"
                value={mainSelectedRow?.dispatch_fee_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="dispatch_fee_cost"
                value={mainSelectedRow?.dispatch_fee}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="dispatch_fee_profit"
                value={mainSelectedRow?.dispatch_fee_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="customs_clearance"
                value={mainSelectedRow?.customs_clearance}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="customs_clearance_vat"
                value={mainSelectedRow?.customs_clearance_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="customs_clearance_cost"
                value={mainSelectedRow?.customs_clearance}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="customs_clearance_profit"
                value={mainSelectedRow?.customs_clearance_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="dtd_handling"
                value={mainSelectedRow?.dtd_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="dtd_handling_vat"
                value={mainSelectedRow?.dtd_handling_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="dtd_handling_cost"
                value={mainSelectedRow?.dtd_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="dtd_handling_profit"
                value={mainSelectedRow?.dtd_handling_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="special_handling"
                value={mainSelectedRow?.special_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="special_handling_vat"
                value={mainSelectedRow?.special_handling_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="special_handling_cost"
                value={mainSelectedRow?.special_handling_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="special_handling_profit"
                value={mainSelectedRow?.special_handling} /*금액*/
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="trucking"
                value={mainSelectedRow?.trucking}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
                }}
              />
              <MaskedInputField
                id="trucking_vat"
                value={mainSelectedRow?.trucking_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="trucking_cost"
                value={mainSelectedRow?.trucking_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="trucking_profit"
                value={mainSelectedRow?.trucking_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="air_freight"
                value={mainSelectedRow?.air_freight}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="air_freight_vat"
                value={mainSelectedRow?.air_freight_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="air_freight_cost"
                value={mainSelectedRow?.air_freight}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="air_freight_profit"
                value={mainSelectedRow?.air_freight_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="bl_handling"
                value={mainSelectedRow?.bl_handling}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />

              <MaskedInputField
                id="bl_handling_vat"
                value={mainSelectedRow?.bl_handling_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="bl_handling_cost"
                value={mainSelectedRow?.bl_handling_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="bl_handling_profit"
                value={(
                  Number(mainSelectedRow?.bl_handling?.replace(/,/g, "") || 0) -
                  Number(
                    mainSelectedRow?.bl_handling_vat?.replace(/,/g, "") || 0
                  )
                ).toLocaleString()}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: true,
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
                id="other_1"
                value={mainSelectedRow?.other_1}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_1_vat"
                value={mainSelectedRow?.other_1_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_1_cost"
                value={mainSelectedRow?.other_1}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_1_profit"
                value={mainSelectedRow?.other_1_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
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
                id="other_2"
                value={mainSelectedRow?.other_1}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_2_vat"
                value={mainSelectedRow?.other_1_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_2_cost"
                value={mainSelectedRow?.other_1}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_2_profit"
                value={mainSelectedRow?.other_1_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
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
                id="other_3"
                value={mainSelectedRow?.other_3}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_3_vat"
                value={mainSelectedRow?.other_3_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_3_cost"
                value={mainSelectedRow?.other_3_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
                }}
              />
              <MaskedInputField
                id="other_3_profit"
                value={mainSelectedRow?.other_3_profit}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                  disableSpacing: true,
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
                value={mainSelectedRow?.total}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="total_vat"
                value={mainSelectedRow?.total_vat}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="total_cost"
                value={mainSelectedRow?.total_cost}
                options={{
                  ...AmountInputOptions,
                  isReadOnly: popup.popType === crudType.CREATE ? false : true,
                }}
              />
              <MaskedInputField
                id="total_profit"
                value={mainSelectedRow?.total_profit}
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
              value={mainSelectedRow?.remark}
              options={{ isReadOnly: false }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Amount;
