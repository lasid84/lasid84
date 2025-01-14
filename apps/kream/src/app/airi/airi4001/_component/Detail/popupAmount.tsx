"use client";

import { useRef, useEffect } from "react";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { MaskedInputField } from "@/components/input/react-text-mask";
import { Store, AmountInputOptions } from "../../_store/store";
import { Input } from "@mui/material";
import { DTDLabel,DTDLabel2 } from "@/components/label/index";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  loadItem?: any | null;
  params?: {
    waybill_no: string;
  };
};

const Amount: React.FC<Props> = ({ loadItem, params }) => {
  const gridRef = useRef<any | null>();
  const { objState } = useAppContext();
  const mainSelectedRow = Store((state) => state.mainSelectedRow);
  const popup = Store((state) => state.popup);
  const state = Store((state) => state);
  const actions = Store((state) => state.actions);

  useEffect(() => {
    if (gridRef?.current) {
      //console.log('gridRef.current', gridRef.current)
      //  actions.setState({ gridRef_Detail: gridRef.current?.api });
    }
  }, [gridRef.current]);

  useEffect(() => {
    if (objState.isDSearch) {
      //   CarrierContRefetch();
      // log("grid Data?", EDIDetailData);
      // EDIDetailRefetch();
      // dispatch({ isDSearch: false });

      const fetchDataAsync = async () => {
        // const {data: newData } = await EDIDetailRefetch();
        // const detail = (newData as string[])[1]? ((newData as string[])[1] as gridData).data : [];
        // log('grid Data??? - detail', detail, newData)
      };
      fetchDataAsync();
    }
  }, [objState.isDSearch]);

  return (
    <>
      <div className="w-full gap-4 min-h-[30vh] p-2">
        <div className="flex flex-col w-full h-full p-1 p-2 border rounded-lg">
           {/* Title Row */}
            <div 
              className="grid gap-4 mb-4" 
              style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
            >
            <DTDLabel2 id="" name="" lwidth="40" backgroundColor="white" />
            <DTDLabel2 id="amount" name="amount" lwidth="40" backgroundColor="gray"/>
            <DTDLabel2 id="vat" name="vat" lwidth="40" backgroundColor="red"/>
            <DTDLabel2 id="cost" name="cost" lwidth="40" backgroundColor="yellow"/>
            <DTDLabel2 id="profit" name="profit" lwidth="40" backgroundColor="blue"/>
          </div>

          {/* 관세 */}
            <div 
              className="grid gap-4 " 
              style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
            >
            <DTDLabel id="customs_duty" name="customs_duty" lwidth="40" />
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
                bgColor : "transparent",
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="customs_tax" name="customs_tax" lwidth="40" />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="bonded_wh" name="bonded_wh" lwidth="40" />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="dispatch_fee" name="dispatch_fee" lwidth="40" />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel
              id="customs_clearance"
              name="customs_clearance"
              lwidth="40"
            />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="dtd_handling" name="dtd_handling" lwidth="40" />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel
              id="special_handling"
              name="special_handling"
              lwidth="40"
            />
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
              value={mainSelectedRow?.special_handling}  /*금액*/
              options={{
                ...AmountInputOptions,
                isReadOnly: popup.popType === crudType.CREATE ? false : true,
              }}
            />
          </div>

          {/* 운송료 */}
          <div 
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="trucking" name="trucking" lwidth="40" />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="air_freight" name="air_freight" lwidth="40" />
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
            className="grid gap-4 " 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="bl_handling" name="bl_handling" lwidth="40" />
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
              value={ (Number(mainSelectedRow?.bl_handling?.replace(/,/g, '') || 0) - 
              Number(mainSelectedRow?.bl_handling_vat?.replace(/,/g, '') || 0)).toLocaleString()}
              options={{
                ...AmountInputOptions,
                isReadOnly: true,
              }}
            />
          </div>

          {/* 보험료 */}
          <div 
            className="grid gap-4" 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="other_1" name="other_1" lwidth="40" />
            <MaskedInputField
              id="other_1"
              value={mainSelectedRow?.other_1}
              options={{
                ...AmountInputOptions,
                isReadOnly: popup.popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="other_1_vat"
              value={mainSelectedRow?.other_1_vat}
              options={{
                ...AmountInputOptions,
                isReadOnly: popup.popType === crudType.CREATE ? false : true,
              }}
            />
            <MaskedInputField
              id="other_1_cost"
              value={mainSelectedRow?.other_1}
              options={{
                ...AmountInputOptions,
                isReadOnly: popup.popType === crudType.CREATE ? false : true,
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

          {/* 합계 */}
          <div 
            className="grid gap-4" 
            style={{ gridTemplateColumns: "0.5fr repeat(4, 1fr)" }}
          >
            <DTDLabel id="total" name="total" lwidth="40" />
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
      </div>
    </>
  );
};

export default Amount;
