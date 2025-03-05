"use client";

import React, { useEffect, useCallback, useRef, memo, useState } from "react";
import { PageMGrid3,PageMGrid4 } from "layouts/grid/grid";
import Grid from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import {
  SelectionChangedEvent,
} from "ag-grid-community";
import { useCommonStore } from "../_store/store";

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const gridRef = useRef<any | null>(null);

  const mainDatas = useCommonStore((state) => state.mainDatas);
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const actions = useCommonStore((state) => state.actions);
 
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    colVisible: {
      col: [
        "create_date",
        "create_user",
        "update_date",
        "update_user",
      ],
      visible: false,
    },
    pinned: {
      __ROWINDEX : "left",
    },
    dataType: {
      tot_balance : "number",
      total_insert : "number",
      total_refund : "number",
      total_adjust : "number",
  },
  total : {
    cust_nm : "count",
    tot_balance : "sum"
  },
    isAutoFitColData: false,
    isShowRowNo: true,
  };

  const handleSelectionChanged = useCallback(
    (param: SelectionChangedEvent) => {
      const selectedRow = param.api.getSelectedRows()[0];
      actions.setState({ mainSelectedRow: selectedRow });
      actions.getDetailDatas(selectedRow)
    },[]); 

  return (
    <>    
      <PageMGrid4>
        <Grid
          id="gridMaster_4003"
          gridRef={gridRef}
          listItem={mainDatas as gridData}
          options={gridOptions}
          event={{
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageMGrid4>
    </>
  );
});

export default MasterGrid;
