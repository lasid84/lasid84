"use client";

import { useRef, memo } from "react";
import Grid, { rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption } from "components/grid/ag-grid-enterprise";
import type { RowClickedEvent } from "ag-grid-community";
import { ToolBar } from "./toolBar";
import { useCommonStore } from "../_store/store";
import { toast } from "react-toastify";
import { t } from "i18next";

import Popup from "../_component/Detail/popup";
import FloatingButton from "../_component/floatingButton";

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(() => {
  const gridRef = useRef<any | null>(null);

  const { setPopupOpen } = useCommonStore((state) => state.actions);
  const mainDatas = useCommonStore((state) => state.mainDatas);

  const originCellStyles = (params: any) => {
    let data = params.data.origin;

    switch (data) {
      case "BKK" :
          return "bg-lightskyblue";
      case "CKG" :
          return "bg-lightivory";
      case "HAN" :
          return "bg-lightpink";
      case "CTU" :
        return "bg-lightcyan";
      case "HKG" :
        return "bg-lightbeige";
      case "CGO" :
        return "bg-lightlavender";
      case "PVG" :
        return "bg-lightgreenbright";
      default :
        return "bg-red";
    }
  };

  const transportTypeCellStyles = (params: any) => {
    let data = params.data.transport_type;

    return (data === "HUB AC"? "bg-lightorange" : "");
  };
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    checkbox: ["chk", "use_yn"],
    rowDivide: "transport_type",
    editable: ["rlsddlvy_local_dd", "pod_local_dd", "loading_loc", "loading_remark", "edi_yn"],
    autoHeightCol: ["delivery_no", "measurement", "unloading_manager", "loc_nm_short", "request_tm_date", "remark"],
    isAutoFitColData: true,
    isMultiSelect: false,
    isVerticalCenter: true,
    preWrap: true,
    isEditableAllNewRow: true,
    rowSpanByConfig: {
      targetCol: ["origin", "waybill_no", "piece", "gross_wt", "flt", "loading_loc", "transport_type", "arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd"],
      compareCol: {
        transport_type: ["Reseller"]
      },
      standardCol: "waybill_no"
    },
    multipleCells: {
      targetCol: ["DN & Sorting(If needed)"],
      compareCol: {
        transport_type: ["Reseller", "Telecom"]
      },
      spliter: "|"
    },
    cellClass: {
      origin: originCellStyles,
      transport_type: transportTypeCellStyles
    },
    dataType: {
      arv_local_dd: "date",
      oltib_local_dd: "date",
      ice_local_dd: "date",
      clrcstms_local_dd: "date",
      rlsddlvy_local_dd: "date",
      pod_local_dd: "date",
      gross_wt: "number",
    },
    pinned: {
      __ROWINDEX: "left",
      origin: "left",
      waybill_no: "left",
      piece: "left",
      gross_wt: "left",
      flt: "left",
      loading_loc: "left",
      transport_type: "left"
    }
  };

  /**
   * @Handler
   * Summary : Floating Button(열 추가)
   */
  const handleAddRow = async () => {
    const data = await rowAdd(gridRef.current, {});
    if (gridRef.current) {
      const api = gridRef.current.api;
      const node = api.getRowNode((data[0].__ROWINDEX -1).toString());
      if (node) {
        const columns = api.getColumnDefs();
      }
    }
  };
  
  /**
   * @Handler
   * Summary : Floating Button(수정/등록)
   */
  const handleSaveRow = async () => {
    const changeRows = [];
    if (gridRef.current) {
      const api = gridRef.current.api;
      const rowCount = api.getDisplayedRowCount();
      for (let i=0; i< rowCount; i++) {
        const data = api.getRowNode(i.toString()).data;
        if (data.__changed) {
          if (!data.waybill_no || data.waybill_no === "") {
            toast(t("MSG_0174")); // BL No.는 필수입니다.
            break;
          }
          changeRows.push(data);
          data.__changed = false;
        }
      }
    }
  };

  /**
   * @Handler
   * ag grid - 상세 팝업 핸들러
   */
  const handleRowDoubleClicked = (param: RowClickedEvent) => {
    const focusedCell = param.api.getFocusedCell();

    if (focusedCell?.column.getColId() !== "__ROWINDEX")
        return;

    setPopupOpen(true);
  };

  return (
      <>
        <ToolBar gridRef={gridRef} gridOptions={gridOptions} />
        <Grid
          id="gridMaster"
          gridRef={gridRef}
          listItem={mainDatas}
          options={gridOptions}
          event={{
            onRowDoubleClicked: handleRowDoubleClicked
          }}
        />
        <FloatingButton
          buttonList={[
            { id:"add", label: "열 추가", size: "20", onClick:handleAddRow },
            { id:"save", label: "수정/등록", size: "20", onClick:handleSaveRow }
          ]}
        />
        <Popup loadItem={{}} />
      </>
  );
});

export default MasterGrid;
