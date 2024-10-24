"use client";

import { useRef, memo, useEffect, useState } from "react";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import PageSearch, { PageBKCargo, PageContent } from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { CellClickedEvent } from "ag-grid-community";
import ChargePopup from "components/commonForm/chargecode";
import { Label } from "@/components/label";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
  bkData?: any
};

const GridCost: React.FC<Props> = ({ initData, bkData }) => {
  const { dispatch, objState } = useAppContext();
  const gridRef = useRef<any | null>();

  // const { Update: SaveCostData } = useUpdateData2(SP_SaveCostData);
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const [isChargePopupOpen, setIsChargePopupOpen] = useState(false);
  const [clickedRowNode, setClickedRowNode] = useState<any>(null);

  useEffect(() => {
    if (gridRef && gridRef.current){
      // log("gridRef injection")
      dispatch({gridRef_cost: gridRef});
    }      
  }, [gridRef.current])

  useEffect(() => {
    // log("useEffect gridCost", bkData?.cost);
    const gridOption: GridOption = {
      colVisible: {
        col: ["bk_id", "template_id", "seq", "uuid", "sort_id", "print_ind", "vat_cat_code_ap",
          "import_export_ind", "invoice_charge_amt", "invoice_currency_code",
          "type", "create_date", "create_user", "update_date", "update_user" ],
        visible: false,
      },
      gridHeight: "60vh",
      checkbox: ["use_yn"],
      select: {
        invoice_wb_currency_code: initData[19]?.data.map((row: any) => row["curr"]),
        cost_currency_code: initData[19]?.data.map((row: any) => row["curr"]),
      },
      // icon : {
      //   icon : IconSelect,
      //   vendor_id : IconSelect
      // },
      maxWidth: { use_yn: 120 },
      minWidth: {
        use_yn: 70,
      },
      dataType: { "invoice_wb_amt": "number", "invoice_charge_amt": "number", "actual_cost_amt": "number" },
      editable: ["waybill_no", "remark", "charge_code", "charge_desc", "sort_id", "import_export_ind", "ppc_ind", "invoice_wb_amt", "invoice_wb_currency_code", "invoice_charge_amt", "actual_cost_amt", "cost_currency_code", "vendor_id", "vendor_ref_no",  "print_ind", "vat_cat_code_ap", "use_yn"],
      isShowFilter: false,
      isAutoFitColData: false,
    };
    setGridOptions(gridOption);
  }, [initData, bkData]);


  const handleClick = () => {
    rowAdd(gridRef.current, {
      bk_id: objState.MselectedTab,
      use_yn: true,
      import_export_ind: objState.trans_type,
      type: 'I',
      waybill_no: bkData?.waybill_no?.split(',').shift()
    });

    setTimeout(() => {
      const allRowNodes: any[] = [];
      gridRef.current.api.forEachNode((node: any) => allRowNodes.push(node));

      // 마지막 행을 가져옵니다
      const lastRowNode = allRowNodes[allRowNodes.length - 1];

      // 마지막 행을 clickedRowNode로 설정합니다
      setClickedRowNode(lastRowNode);

      // 마지막 행으로 스크롤
      gridRef.current.api.ensureIndexVisible(lastRowNode.rowIndex);

      // ChargeCode 팝업을 엽니다 (필요한 경우)
      setIsChargePopupOpen(true);
    }, 200);
  };

  const handleCellClicked = (params: CellClickedEvent) => {
    log("handleCellClicked", params, params.column.getColId());
    if (params.column.getColId() === 'charge_code') {
      setClickedRowNode(params.node);
      setIsChargePopupOpen(true);
    }
  }

  const handleChargeCodeSelected = (selectedRow: {charge_code: string, charge_desc: string}) => {
    if (clickedRowNode && gridRef.current) {
      let hasData = false;
      let lastUpdatedColumn = '';
      // Object.entries(selectedRow).forEach(([key, value]) => {
      for (const [key,value] of Object.entries(selectedRow)) {
        if (key === 'charge_code' || key === 'charge_desc') {
          // log("handleChargeCodeSelected", key, value);
          clickedRowNode.setDataValue(key, value);
          hasData = true;
          lastUpdatedColumn = key;
        }
      };

      if (hasData) {
          // Get all columns
        const allColumns = gridRef.current?.api.getAllDisplayedColumns();
        // Find the index of the last updated column
        const lastUpdatedColumnIndex = allColumns.findIndex((col:any) => col.getColId() === lastUpdatedColumn);
        // If there's a next column, set focus to it
        if (lastUpdatedColumnIndex < allColumns.length - 1) {
          const nextColumn = allColumns[lastUpdatedColumnIndex + 1];
          // gridRef.current.api.setFocusedCell(clickedRowNode.rowIndex, nextColumn.getColId());
          setTimeout(() => {
            // 다음 셀로 포커스 이동
            gridRef.current.api.setFocusedCell(clickedRowNode.rowIndex, nextColumn.getColId());
          }, 200);
        }
      }
    } 
  }

  return (
    <>
      <PageBKCargo
        right={
          <>
            <Button id={"add"} onClick={handleClick} width="w-20" />
            {/* <Button id={"save"} onClick={onSave} width="w-15" /> */}
          </>
        }
        left={
          <>
            <Label id={"cost_info"} name={"MSG_0180"} isDisplay={true} textColor="red-400" />
          </>
        }
      >
        <>
          <Grid
            id="cost"
            gridRef={gridRef}
            listItem={bkData?.cost as gridData}
            options={gridOptions}
            event={{
              onCellClicked: handleCellClicked
            }}
          />
          {isChargePopupOpen && 
            <ChargePopup 
              params={{
                trans_mode: objState.trans_mode,
                trans_type: objState.trans_type
              }} 
              isOpen={isChargePopupOpen} 
              callbacks={[() => setIsChargePopupOpen(false)]}
              onSelect={handleChargeCodeSelected}
            />}
        </>
      </PageBKCargo>
    </>
  );
};

export default GridCost;
