"use client";

import React, { useEffect, useCallback, useRef, memo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toastSuccess } from "components/toast";
import { PageMGrid3 } from "layouts/grid/grid";
import { Button } from "components/button";
import Grid, {
  ROW_CHANGED,
  rowAdd,
  ROW_TYPE_NEW,
} from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import {
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../_store/store";
import { DatePicker } from "components/date";
import Switch from "components/switch/index";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  initData?: any | null;
};

const DetailGrid: React.FC<Props> = memo(({ initData }) => {
  const gridRef = useRef<any | null>(null);
  const state = useCommonStore((state) => state);
  const actions = useCommonStore((state) => state.actions);
  const detailDatas = useCommonStore((state) => state.detailDatas);
  
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
      waybill_no: "left",
      cnee_nm: "left",
      ready : "right",
      // cargtrcnrelabsoptpcd : "right", --처리구분
    },
    total: {
      waybill_no: "count" , trans_amount : "sum"
    },
    dataType: {
      trans_amount : "number",
      trans_date : "date",
      create_date : "date"
  },
    isAutoFitColData: false,
    isShowRowNo: true,
  };

  /*
    handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
  */
  const handleRowClicked = useCallback((param: RowClickedEvent) => {
    var selectedRow = { colId: param.node.id, ...param.node.data };
    // dispatch({mSelectedRow:selectedRow});
  }, []);

  const handleRowDoubleClicked = (param: RowClickedEvent) => {
    const focusedCell = param.api.getFocusedCell();
    var selectedRow = { colId: param.node.id, ...param.node.data };
  };

  const handleSelectionChanged = useCallback(
    (param: SelectionChangedEvent) => {
      const selectedRow = param.api.getSelectedRows()[0];
      log("selectedRow", selectedRow);
    },[]
  );
 


  return (
    <>
      {/* <PageMGrid3> */}
        <Grid
          id="gridDetail_4003"
          gridRef={gridRef}
          listItem={detailDatas as gridData}
          options={gridOptions}
          event={{
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      {/* </PageMGrid3> */}
    </>
  );
});

export default DetailGrid;
