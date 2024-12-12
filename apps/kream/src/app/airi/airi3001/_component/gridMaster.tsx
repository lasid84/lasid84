"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import { SP_GetEDIData, SP_InsertData, SP_UpdateData } from "./data";
import {
  crudType,
  useAppContext,
} from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import {toastSuccess} from "components/toast"
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Switch from "components/switch/index"
import DetailModal from "./Detail/popup"
import ExcelUploadModal from "./ExcelUpload/popup"

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const gridRef = useRef<any | null>(null);
  const { dispatch, objState = {} } = useAppContext();
  const { searchParams, isMSearch, popUp } = objState;
  const { popType, isPopUpOpen, isPopUpUploadOpen} = popUp
  const { Create } = useUpdateData2(SP_InsertData, SEARCH_M);
  const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M);
  const [gridData, setGridData] = useState<gridData>();
  const {
    data: mainData,
    refetch: mainRefetch,
    remove: mainRemove,
  } = useGetData(searchParams, SEARCH_M, SP_GetEDIData, { enabled: true });


  const gridOptions: GridOption = {
    gridHeight: "h-full",
    minWidth: {
      waybill_no: 150,
      invoice_no: 150,
      senddatetime: 180,
      invoice_dd : 120,
      create_date: 180,
    },
    maxWidth: {
      waybill_no: 170,
      invoice_no: 170,
      senddatetime: 200,
      send: 100,
    },
    pinned : {
      waybill_no : "left",
      invoice_no : "left",
      create_date : "right",
      send : "right",
      senddatetime : "right",
      ready : "right",
    },
    editable : ["ready"],
    checkbox: ["ready"],
    dataType: { create_date: "date", senddatetime: "date" , invoice_dd : "date"},
    isMultiSelect: true,
    total: {
      invoice_no:"count", waybill_no:"count" ,invoicevalue:"sum",
    },
    isAutoFitColData: true,
    rowSpan: ["rowno", "cargmtno", "mblno", "hblno"],
    isShowRowNo: false,  
    cellClass: {
      send: (params) => {
        return params.value != 'N' ? "bg-green" : "bg-red";
      },
    },
  };

  /*
    handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
  */
  const handleRowClicked = useCallback((param: RowClickedEvent) => {
    var selectedRow = {"colId": param.node.id, ...param.node.data}
    dispatch({mSelectedRow:selectedRow});
  }, []);

  const handleRowDoubleClicked = (param: RowClickedEvent) => {
    var selectedRow = { colId: param.node.id, ...param.node.data };
    log("handleRowDoubleClicked", selectedRow);
    dispatch({
      mSelectedRow: selectedRow,
      popUp : { ...popUp, crudType: crudType.UPDATE, isPopUpOpen: true }, //추가
      isDSearch : true,
      isPopUpOpen: true,
      crudType: crudType.UPDATE,
    });
  };

  const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
    const selectedRow = param.api.getSelectedRows()[0];
    dispatch({ mSelectedRow: selectedRow });
  }, []);



  useEffect(() => {
    if (isMSearch) {
      mainRefetch();
      dispatch({ isMSearch: false });
    }
  }, [isMSearch]);

  useEffect(() => {
    setGridData(mainData as gridData);
  }, [mainData]);

  const onSave = () => {
    const processNodes = async () => {
      const api = gridRef.current.api;
      for (const node of api.getRenderedNodes()) {
        var data = node.data;
        log("onSave data", node.data);
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
        if (data.__changed) {
          try {
            if (data.__ROWTYPE === ROW_TYPE_NEW) {
              await Create.mutateAsync(data);
            } else {
              await Update.mutateAsync(data);
            }
          } catch (error) {
            log("error:", error);
          } finally {
            data.__changed = false;
          }
        }
      }
    };
    processNodes()
      .then(() => {
        toastSuccess("Success.");
        dispatch({ isMSearch: true });
      })
      .catch((error) => {
        log.error("node. Error", error);
      });
  };

  const onExcelUpload= () => {
  //   dispatch({ crudType: crudType.CREATE, isPopUpUploadOpen: true })  }
     dispatch({ popUp : { ...popUp, crudType: crudType.CREATE, isPopUpUploadOpen: true }, })  
  }

  return (
    <>
      <PageMGrid3
        title={<><Button id={"upload_excel"} onClick = {onExcelUpload} disabled={false}  label='upload_excel' width='w-34' />
                 <Button id={"extract_hscode"}  onClick="" width="w-34" toolTip="ShortCut: Ctrl+S"/></>}
        right={<><Switch/><Button id={"send"} onClick={onSave} width='w-34' /></>}
      >
        <Grid
          id="gridMaster"
          gridRef={gridRef}
          // loadItem={initData}
          listItem={gridData}
          options={gridOptions}
          event={{
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageMGrid3>
      <DetailModal loadItem={initData}/>
      <ExcelUploadModal loadItem={initData}/>
    </>
  );
});

export default MasterGrid;
