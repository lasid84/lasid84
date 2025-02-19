"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { useCommonStore } from "../../../_store/store";
import { useFormContext } from "react-hook-form";

import { log } from '@repo/kwe-lib-new';

type Props = {
  initData?: any | null;
  shipping_type: string;
};

const CustChargeGrid: React.FC<Props> = memo(({shipping_type}) => {
  const gridRef = useRef<any | null>(null);

  const custChargeDatas = useCommonStore((state) => state.custChargeDatas);
  const selectedCustData = useCommonStore((state) => state.selectedCustData);
  const selectedTab = useCommonStore((state) => state.selectedTab);
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const { getValues } = useFormContext();

  const gridOptions: GridOption = {
    gridHeight: "h-full",
    // checkbox: ["chk", "use_yn"],
    colVisible: { col : ["cust_code", "cust_mode", "shipping_type"], visible:false },
    dataType: { 
         },
    isShowRowNo:false,
    isAutoFitColData: false,
    isMultiSelect: false,
    editable: ["delivery_request_dd", "revised_edd", "reason", "use_yn"],
  };

  useEffect(() => {
    const params = {
        cust_code: selectedCustData?.cust_code, 
        cust_mode: (state.trans_mode ?? '') + state.trans_type, 
        shipping_type: shipping_type, 
    }
    actions.getCustChargeDatas(params);
    
  }, [selectedCustData?.cust_code])

  const onSave = async () => {
      // const api = gridRef.current.api;
      // const changedDatas:any = [];
      // await api.forEachNode((node:RowNode) => {
      //   var data = node.data;
      //   gridOptions?.checkbox?.forEach((col) => {
      //     data[col] = data[col] ? "Y" : "N";
      //   });
      //   if (data.__changed) {
      //     if (!data.delivery_request_dd) {
      //       toast(t("MSG_0191"));  //요청일은 필수 값입니다.
      //       return;
      //     }

      //     try {
      //       changedDatas.push(data);
      //     } catch (error) {
      //       log("error:", error);
      //     } finally {
      //       data.__changed = false;
      //     }
      //   }
      // });
      
      // if (changedDatas.length > 0) {
      //   await actions.setAppleDatas({jsonData: JSON.stringify(changedDatas)});
      //   await actions.getAppleDatas(getValues());
      // } else {
      //   toast(t("msg_0006"));  //변경 내역이 없습니다.
      // }
  };


  return (
    <>
      <Grid
        id="CustChargeGrid"
        gridRef={gridRef}
        listItem={custChargeDatas}
        options={gridOptions}
        event={{
          onCellClicked(params) {
            const data = params.data;
            const selectedCol = params.column.getColId();
            // log("onCellClicked", params, data, selectedCol, data[selectedCol]);
            actions.setState({selectedCharge: selectedCol});
          },
        }}
      />
    </>
  );
});

export default CustChargeGrid;
