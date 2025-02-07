"use client";

import { useRef, memo } from "react";
import Grid, { rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption } from "components/grid/ag-grid-enterprise";
import { useFormContext } from "react-hook-form";
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
  const { getValues } = useFormContext();

  const gridRef = useRef<any | null>(null);

  const actions = useCommonStore((state) => state.actions);
  const mainDatas = useCommonStore((state) => state.mainDatas);
  const locationList = useCommonStore((state) => state.locationList);

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
    colVisible: {
      col: ["transport_id"],
      visible: false
    },
    changeColor: ["arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd", "pod_local_dd"],
    checkbox: ["chk", "use_yn"],
    select: {
      loc_nm_short: locationList,
    },
    rowDivide: "transport_type",
    editable: ["origin", "flt", "loading_loc", "qty", "loc_nm_short", "unloading_area", "unloading_manager", "contact", "request_tm_date", "remark", "loading_remark", "edi_yn", "arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd", "pod_local_dd"],
    heightColByConfig: {
      targetList: ["unloading_manager", "loc_nm_short", "request_tm_date", "remark"],
      excludeFormula: {
        transport_type: ["Reseller"]
      },
      normalHeight: 25,
      expandHeight: 165
    },
    rowHeight: 25,
    isAutoFitColData: true,
    isMultiSelect: false,
    isVerticalCenter: true,
    isEditableAllNewRow: true,
    largetextPreWrap: true,
    columnSpanByConfig: {
      targetCol: ["DN & Sorting"],
      compareCol: {
        transport_type: ["HUB", "HUB AC"]
      }
    },
    rowSpanByConfig: {
      targetCol: ["origin", "waybill_no", "piece", "gross_wt", "flt", "loading_loc", "transport_type", "arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd"],
      compareCol: {
        transport_type: ["Reseller"]
      },
      standardCol: "waybill_no"
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
      loc_nm_short: "largetext",
      contact: "largetext",
      request_tm_date: "largetext",
      remark: "largetext"
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

      if (changeRows.length > 0) {
        const values = getValues();
        await actions.updateOperationListData({jsonData: JSON.stringify(changeRows)});
        await actions.getOperationListData(values.fr_date, values.no);
      } else {
        toast(t("msg_0006")); // 변경 내역이 없습니다.
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

    actions.setPopupOpen(true);
  };

  /**
   * @Handler
   * UFSP 마일스톤 등록 시작
   */
  const handleRegistMilestone = async () => {
    const waybillList:string[] = [];
    if (gridRef.current) {
      const api = gridRef.current.api;
      api.forEachNode((node: any) => {
        if (!waybillList.includes(node.data["waybill_no"])) {
          waybillList.push(node.data["waybill_no"]);
        }
      })
    }
    
    if (waybillList.length > 0) {
      await actions.setMilestoneEdiData({waybillList: waybillList.join(',')});
    } else {
      toast(t("msg_0006")); // 변경 내역이 없습니다.
    }
  };

  /**
   * @Handler
   * UFSP 마일스톤 데이터 검증
   */
  const handleVerifyMilestone = async () =>  {
    const waybillList:string[] = [];
    if (gridRef.current) {
      const api = gridRef.current.api;
      api.forEachNode((node: any) => {
        if (!waybillList.includes(node.data["waybill_no"])) {
          waybillList.push(node.data["waybill_no"]);
        }
      })

      if (waybillList.length > 0) {
        const interfaceList = await actions.getMilestoneInterfaceData({waybillList: waybillList.join(',')});
        for (let data of interfaceList) {
          api.forEachNode((node: any) => {
            if (node.data.waybill_no === data.waybill_no) {
              if (node.data.transport_type === "Reseller") {
                if (node.data.milestone === "POD") {
                  if (node.data["DN & Sorting"] === data.delivery_no) {
                    if (node.data[data.milestone.toLowerCase().concat("_local_dd")] === data.local_dd) {
                      const key = data.milestone.toLowerCase().concat("_local_dd").concat("_flag");
                      const column = data.milestone.toLowerCase().concat("_local_dd");
                      node.data[key] = "Y";
                    } else {
                      const key = data.milestone.toLowerCase().concat("_local_dd").concat("_flag");
                      const column = data.milestone.toLowerCase().concat("_local_dd");
                      node.data[key] = "N";
                    }
                  }
                } else {
                  if (node.data[data.milestone.toLowerCase().concat("_local_dd")] === data.local_dd) {
                    const key = data.milestone.toLowerCase().concat("_local_dd").concat("_flag");
                    const column = data.milestone.toLowerCase().concat("_local_dd");
                    node.data[key] = "Y";
                  } else {
                    const key = data.milestone.toLowerCase().concat("_local_dd").concat("_flag");
                    const column = data.milestone.toLowerCase().concat("_local_dd");
                    node.data[key] = "N";
                  }
                }
              } else {
                if (node.data[data.milestone.toLowerCase().concat("_local_dd")] === data.local_dd) {
                  const key = data.milestone.toLowerCase().concat("_local_dd").concat("_flag");
                  const column = data.milestone.toLowerCase().concat("_local_dd");
                  node.data[key] = "Y";
                } else {
                  const key = data.milestone.toLowerCase().concat("_local_dd").concat("_flag");
                  const column = data.milestone.toLowerCase().concat("_local_dd");
                  node.data[key] = "N";
                }
              }
            }
          })
        }
      } else {
        toast(t("msg_0006")); // 변경 내역이 없습니다.
      }

      gridRef.current.api.refreshCells({ force: true });
    }
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
            { id:"save", label: "수정/등록", size: "20", onClick:handleSaveRow },
            { id:"milestone", label:"UFS 연동", size: "20", onClick: handleRegistMilestone },
            { id:"verify", label:"검증", size: "20", onClick: handleVerifyMilestone }
          ]}
        />
        <Popup loadItem={{}} />
      </>
  );
});

export default MasterGrid;
