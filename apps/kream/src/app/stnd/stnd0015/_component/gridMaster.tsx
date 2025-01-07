'use client';

import { useEffect, useCallback, useRef, memo, useState, RefObject, forwardRef, MutableRefObject, } from "react";
import Grid, { ROW_CHANGED } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { Button } from "@/components/button";
import { PageMGrid3 } from "@/layouts/grid/grid";
import { useCommonStore } from "../_store/store";
import { useFormContext } from "react-hook-form";
import { SelectionChangedEvent } from "ag-grid-community";
import { use } from "i18next";
import { AgGridReact } from "ag-grid-react";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
  // gridRef: RefObject<AgGridReact>
};

const MasterGrid = memo(forwardRef<AgGridReact, Props>(({}, gridRef) => {

  const maindDatas = useCommonStore((state) => state.mainDatas);
  const actions = useCommonStore((state) => state.actions);
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    checkbox: ["chk"],
    colVisible: { col : ["cnee_nm", "transport_type_nm", "loc_nm", "loc_nm_short"], visible:true },
    isShowRowNo:true,
    isAutoFitColData: false,
    isSelectRowAfterRender: true,
  };

  // useEffect(() => {
  //   log("gridRef", gridRef, gridRef?.current);
  // }, [gridRef, gridRef?.current]);

  const handleSelectionChanged = useCallback((e: SelectionChangedEvent) => {
    const gridRefObject = gridRef as React.MutableRefObject<AgGridReact | null>;
    const selectedRows = gridRefObject.current?.api.getSelectedRows()[0];
    // const selectedRows = gridRef?.current?.api.getSelectedRows()[0];
    log("selectedRows", selectedRows);
    actions.setState({ mainSelectedRow: selectedRows });
  }, []);

  return (
    <>
        <Grid
            id="gridMaster"
            gridRef={gridRef}
            listItem={maindDatas}
            options={gridOptions}
            event={{
              onSelectionChanged: handleSelectionChanged,
            }}
        />
    </>
  );
}));

export default MasterGrid;