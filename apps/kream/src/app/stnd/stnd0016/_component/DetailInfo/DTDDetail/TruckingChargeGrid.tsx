"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { useCommonStore } from "../../../_store/store";
import { useFormContext } from "react-hook-form";

type Props = {
  initData?: any | null;
};

const TruckingChargeGrid: React.FC<Props> = memo(() => {
  const gridRef = useRef<any | null>(null);

  const loadDatas = useCommonStore((state) => state.loadDatas);
  const actions = useCommonStore((state) => state.actions);
  const { getValues } = useFormContext();

  const gridOptions: GridOption = {
    gridHeight: "h-full",
    checkbox: ["chk", "use_yn"],
    colVisible: { col : [""], visible:false },
    dataType: { 
        create_date: "date", pickup_dd: "date", delivery_request_dd:"date", revised_edd : "date"
      , num_pieces:"number" , gross_weight:"number", chargeable_weight:"number" },
    typeOptions: {
      gross_weight: { isAllowDecimal: true, decimalLimit:1},
      chargeable_weight: { isAllowDecimal: true, decimalLimit:1},
    }, 
    // total: { transport_type_nm:"count", num_pieces:"sum" , gross_weight:"sum", chargeable_weight:"sum" },
    isShowRowNo:false,
    isAutoFitColData: false,
    isMultiSelect: false,
    editable: ["delivery_request_dd", "revised_edd", "reason", "use_yn"],
  };

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
        id="TruckingChargeGrid"
        gridRef={gridRef}
        // listItem={}
        options={gridOptions}
        event={{
        }}
      />
    </>
  );
});

export default TruckingChargeGrid;
