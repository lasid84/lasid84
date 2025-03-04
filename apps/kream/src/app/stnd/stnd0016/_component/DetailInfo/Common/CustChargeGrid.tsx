"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import Grid, { ROW_CHANGED, ROW_HIGHLIGHTED,ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { useCommonStore } from "../../../_store/store";
import { useFormContext } from "react-hook-form";

import { log } from '@repo/kwe-lib-new';

type Props = {
  gridRef: any;
  initData?: any | null;
  shipping_type: string;
};

const CustChargeGrid: React.FC<Props> = memo(({gridRef, shipping_type}) => {
  // const gridRef = useRef<any | null>(null);

  const { dtdChargeData, fhChargeData } = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const [mainData, setMainData] = useState<gridData>();
  const { getValues } = useFormContext();

  const gridOptions: GridOption = {
    gridHeight: "h-full",
    // checkbox: ["chk", "use_yn"],
    colVisible: { col : ["charge_type_nm", "rv_charge", "ab_charge", "ab_vendor_id"], visible:true },
    dataType: { 
         },
    isShowRowNo:false,
    isAutoFitColData: false,
    isMultiSelect: false,
    editable: ["rv_charge", "ab_charge", "rv_vendor_id", "ab_vendor_id"],
    isShowFilter: false,
  };

  useEffect(() => {
    // log("dtdChargeData", dtdChargeData)
    if (shipping_type === 'DTD' && dtdChargeData) setMainData(dtdChargeData);
  }, [dtdChargeData])

  useEffect(() => {
    if (shipping_type === 'FH' && fhChargeData) setMainData(fhChargeData);
  }, [fhChargeData])

  // useEffect(() => {
  //   log("mainData",shipping_type, dtdChargeData, fhChargeData, mainData)
  // }, [mainData])

  return (
    <>
      <Grid
        id="CustChargeGrid"
        gridRef={gridRef}
        listItem={mainData}
        options={gridOptions}
        event={{
          onCellClicked(params) {
            const col = params.column.getColId();
            const chargeType = params.data['charge_type'];
            actions.setState({selectedCharge: chargeType});
          },
          onCellValueChanged(params) {
              log(params)
              // const col = params.column.getColId() + '_' + params.data['category2'];
              const col = params.column.getColId();
              const chargeType = params.data['charge_type'];
              const val = params.newValue;
              log("onCellValueChanged", params, col, chargeType, val)
              
              // if (shipping_type === 'DTD') {
              //   if (dtdChargeRateData) {
              //       if (!dtdChargeRateData[col]) {
              //         dtdChargeRateData[col] = {
              //             charge_type: params.column.getColId(), 
              //             category:params.data['category2'],
              //             shipping_type: shipping_type
              //         };
              //       }

              //       dtdChargeRateData[col]['charge_code'] = val;
              //       dtdChargeRateData[ROW_CHANGED] = true;

              //       // log('dtdChargeRateData', dtdChargeRateData);
              //     }
              // } else {
              //   if (fhChargeRateData) {
              //     if (!fhChargeRateData[col]) {
              //         fhChargeRateData[col] = {
              //             charge_type: params.column.getColId(),
              //             category:params.data['category2'],
              //             shipping_type: shipping_type
              //         };
              //     }

              //     fhChargeRateData[col]['charge_code'] = val;
              //     fhChargeRateData[ROW_CHANGED] = true;
              //   }
              // }
          },
        }}
      />
    </>
  );
});

export default CustChargeGrid;
