"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import {toastSuccess} from "components/toast"
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_CHANGED, ROW_HIGHLIGHTED,ROW_TYPE_NEW } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { CellClickedEvent, CellValueChangedEvent, RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Switch from "components/switch/index"
import { Store } from "../_store/store";
import DetailModal from "./Detail/popup"
import ExcelUploadModal from "./ExcelUpload/popup"

import { log, error } from '@repo/kwe-lib-new';
import { useHotkeys } from "react-hotkeys-hook";

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const gridRef = useRef<any | null>(null);
  const state = Store((state=>state));
  const actions = Store((state)=>state.actions);
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    pinned : {
      waybill_no : "left",
      invoice_no : "left",
      create_date : "right",
      send : "right",
      senddatetime : "right",
      ready : "right",
    },
    editable : ["chk"],
    checkbox: ["chk"],
    dataType: { create_date: "date", senddatetime: "date" , invoice_dd : "date",
      invoicevalue: "number"
    },
    isMultiSelect: true,
    total: {
      invoice_no:"count", waybill_no:"count" ,invoicevalue:"sum",
    },
    isAutoFitColData: true,
    // rowSpan: ["rowno", "cargmtno", "mblno", "hblno"],
    isShowRowNo: false,  
    cellClass: {
      send: (params) => {
        return params.value != 'N' ? "bg-green" : "bg-red";
      },
      chk: (params) => {
          return params.data.ready !== 'Y' ? '.disabled-checkbox' : ''
      }
    },
    notManageRowChange: true
  };

  useHotkeys(
      "ctrl+s",
      (event) => {
        event.preventDefault();
        onSave();
      },
      { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] } // form 요소에서 단축키 활성화
    );

  /*
    handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
  */
  const handleRowClicked = useCallback((param: RowClickedEvent) => {
    var selectedRow = {"colId": param.node.id, ...param.node.data}
    // dispatch({mSelectedRow:selectedRow});
  }, []);

  const handleRowDoubleClicked = (param: RowClickedEvent) => {
    var selectedRow = { colId: param.node.id, ...param.node.data };
    actions.setMainSelectedRow(selectedRow)
    actions.updatePopup({
      popType: 'U',
      isPopupOpen: true,
    });
  };

  const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
    const selectedRow = param.api.getSelectedRows()[0];
    // dispatch({ mSelectedRow: selectedRow });
  }, []);

  const handleSwitchClick = (checked:boolean) => {
    if (!gridRef.current) return;
  
    const api = gridRef.current.api;
    api.forEachNode((node:any) => {
      const data = node.data;
      if (data.ready === 'Y') {
        data.chk = checked; // 모든 row의 ready 상태 업데이트
        data.__changed = true;
      }
    });  
    api.refreshCells(); // 그리드 새로고침
  };


  const onSave = () => {
    log("onSave", )
    // const processNodes = async () => {
    //   if (!gridRef.current) return;  
    //   const api = gridRef.current.api;
      
    //   api.forEachNode(async (node: any) => {
    //     const data = node.data;
    //     if (data.__changed) {
    //       gridOptions?.checkbox?.forEach((col) => {
    //         data[col] = data[col] ? "Y" : "N"; // checkbox 컬럼 상태 업데이트
    //       });  
    //       try {
    //         if (data.__ROWTYPE === ROW_TYPE_NEW) {
    //           // await Create.mutateAsync(data); 
    //         } else {
    //           log('data...', data)
    //           // await Update.mutateAsync(data);
    //         }
    //       } catch (error) {
    //         log("Error:", error);
    //       } finally {
    //         data.__changed = false; 
    //       }
    //     }
    //   });
    // };
  
    // processNodes()
    //   .then(() => {
    //     toastSuccess("Success.");
    //     // dispatch({ isMSearch: true });
    //   })
    //   .catch((err) => {
    //     error("Error processing nodes", err);
    //   });
  };

  const onExcelUpload= () => {
    actions.updatePopup({
      popType: 'U',
      isPopupUploadOpen: true,
    });

  }

  const onExtractHSCode = () => {
    
    if (!gridRef.current) return;  
    const api = gridRef.current.api;
    
    let keys: string[] = [];
    api.forEachNode(async (node: any) => {
      const data = node.data;

      keys.push(data["waybill_no"] + data["invoice_no"]);
    });

    actions.getExtractHSCode({
      keys: keys.join(' '),
    });
  }

  function handelCellValueChanged(params: CellValueChangedEvent<any, any>): void {
    const data = params.node.data;
    // log(data)
    if (data.ready === 'N' && data.chk === true) {
      params.node.setDataValue("chk", false);
    }
  }

  return (
    <>
      <PageMGrid3
        title={<><Button id={"upload_excel"} onClick = {onExcelUpload} disabled={false}  label='upload_excel' width='w-34' />
                 <Button id={"extract_hscode"}  onClick={onExtractHSCode} width="w-34" /></>}
        right={<>
          <Switch  onClick={handleSwitchClick}/>
          <Button id={"send"} onClick={onSave} width='w-34' toolTip="ShortCut: Ctrl+S" /></>}
      >
        <Grid
          id="gridMaster"
          gridRef={gridRef}
          // loadItem={initData}
          listItem={state.mainDatas as gridData}
          options={gridOptions}
          event={{
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
            onCellValueChanged: handelCellValueChanged
          }}
        />
      </PageMGrid3>
      <DetailModal/> 
      <ExcelUploadModal/>
    </>
  );
});

export default MasterGrid;
