"use client";

import { useRef, useState, memo } from "react";
import Grid, { rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption } from "components/grid/ag-grid-enterprise";
import { useFormContext } from "react-hook-form";
import type { RowClickedEvent } from "ag-grid-community";
import { ToolBar } from "./toolBar";
import { useCommonStore } from "../_store/store";
import { toast } from "react-toastify";
import { t } from "i18next";

import { GrPowerReset } from "react-icons/gr";

import Popup from "../_component/Detail/popup";
import FloatingButton from "../_component/floatingButton";

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(() => {
  const { getValues } = useFormContext();

  const gridRef = useRef<any | null>(null);

  const [isAddRow, setIsAddRow] = useState(false);

  const actions = useCommonStore((state) => state.actions);
  const mainDatas = useCommonStore((state) => state.mainDatas);
  const loadDatas = useCommonStore((state) => state.loadDatas);

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

  const ediYNCellStyles = (params: any) => {
    let data = params.data.edi_yn;

    return (data === "Y")? "bg-green" : (!data)? "bg-disablegray" : "bg-red";
  };
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    colVisible: {
      col: ["transport_id"],
      visible: false
    },
    changeColor: ["arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd", "pod_local_dd"],
    customSelectCells: {
      loc_nm_short: (loadDatas)? loadDatas[0].data : [],
      transport_type: (loadDatas)? loadDatas[1].data : []
    },
    rowDivide: "transport_type",
    editable: ["origin", "flt", "loading_loc", "qty", "loc_nm_short", "loading_remark", "unloading_area", "unloading_manager", "contact", "request_tm_date", "remark", "arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd", "pod_local_dd"],
    heightColByConfig: {
      targetList: ["unloading_manager", "loc_nm_short", "request_tm_date", "remark"],
      excludeFormula: {
        transport_type: ["Reseller"]
      },
      normalHeight: 25,
      expandHeight: 165
    },
    disableWhenRowAdd: ["piece", "edi_yn", "unloading_area", "unloading_manager", "contact", "request_tm_date", "remark", "arv_local_dd", "oltib_local_dd", "ice_local_dd", "clrcstms_local_dd", "rlsddlvy_local_dd", "pod_local_dd"],
    rowHeight: 25,
    isAutoFitColData: true,
    isMultiSelect: false,
    isVerticalCenter: true,
    isEditableAllNewRow: true,
    largetextPreWrap: true,
    isDistinguishColorWhenAddRow: true,
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
      transport_type: transportTypeCellStyles,
      edi_yn: ediYNCellStyles
    },
    dataType: {
      arv_local_dd: "date_digits_14",
      oltib_local_dd: "date_digits_14",
      ice_local_dd: "date_digits_14",
      clrcstms_local_dd: "date_digits_14",
      rlsddlvy_local_dd: "date_digits_14",
      pod_local_dd: "date_digits_14",
      gross_wt: "number",
      unloading_manager: "largetext",
      loc_nm_short: "largetext",
      contact: "largetext",
      request_tm_date: "largetext",
      remark: "largetext",
      loading_remark: "largetext"
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
    },
    selectFilter: ["transport_type", "edi_yn"]
  };

  /**
   * @Handler
   * Summary : Floating Button(열 추가)
   */
  const handleAddRow = async () => {
    await rowAdd(gridRef.current, {});
    setIsAddRow(true);
  };

  /**
   * @Handler
   * Summary : 열 추가 취소.
   */
  const handleCancelAddRow = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const api = gridRef.current.api;
    if (api) {
      const deleteRows:any = [];
      const originRows:any = [];
      api.forEachNode((node: any) => {
        if (node.data && node.data.__ROWTYPE === "NEW") {
          deleteRows.push(node.data);
        } else {
          originRows.push(node.data);
        }
      });
      
      
      await api.applyTransaction({ remove: deleteRows });
      await api.setRowData(originRows);
      await api.refreshCells({ force: true });
    }

    setIsAddRow(false);
  };
  
  /**
   * @Handler
   * Summary : Floating Button(수정/등록)
   */
  const handleSaveRow = async () => {
    setIsAddRow(false);
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
        await actions.updateOperationListData({jsonData: JSON.stringify(changeRows), fr_date: values.fr_date});
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
    /**
     * TODO
     * 추가 예정
     */
    return;
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
    if (!gridRef.current) {
      return;
    }
      /**
       * @dev
       * 목록 waybill 전체 조회
       */
    const api = gridRef.current.api;
    api.forEachNode((node: any) => {
      if (!waybillList.includes(node.data["waybill_no"])) {
        waybillList.push(node.data["waybill_no"]);
      }
    })

    if (waybillList.length <= 0) {
      toast(t("msg_0006")); // 변경 내역이 없습니다.
      return;
    }

    /**
     * @dev
     * 마일스톤 등록, data interface 완료 상태 waybill 제외.
     */
    const interfaceList = await actions.getMilestoneInterfaceData({waybillList: waybillList.join(',')});

    const alreadyRegistMilestoneList:string[] = [];
    api.forEachNode((node: any) => {
      for (const interfaceData of interfaceList) {
        const isMatching =
          interfaceData.waybill_no === node.data["waybill_no"] &&
          interfaceData.local_dd === node.data["local_dd"] &&
          interfaceData.milestone === node.data["milestone"] &&
          (interfaceData.delivery_no === "" || interfaceData.delivery_no === node.data["delivery_no"]);
      
        if (isMatching && !alreadyRegistMilestoneList.includes(interfaceData.waybill)) {
          alreadyRegistMilestoneList.push(interfaceData.waybill);
        }
      }      
    })

    const targetMilestoneList = waybillList.filter(waybill_no => !alreadyRegistMilestoneList.includes(waybill_no));
    
    if (targetMilestoneList.length <= 0) {
      toast(t("msg_0006")); // 변경 내역이 없습니다.
      return;
    }

    await actions.setMilestoneEdiData({waybillList: targetMilestoneList.join(',')});
  };

  /**
   * @Handler
   * UFSP 마일스톤 데이터 검증
   */
  const handleVerifyMilestone = async () => {
    if (!gridRef.current) return;
  
    const api = gridRef.current.api;
    const waybillList: string[] = [];
  
    api.forEachNode((node: any) => {
      if (!waybillList.includes(node.data["waybill_no"])) {
        waybillList.push(node.data["waybill_no"]);
      }
    });
  
    if (waybillList.length === 0) {
      toast(t("msg_0006"));
      return;
    }
  
    const interfaceList = await actions.getMilestoneInterfaceData({
      waybillList: waybillList.join(","),
    });
  
    /**
     * @dev
     * local_dd 검증 ag grid 컬럼 데이터 임의 추가로 비교
     */
    const updateNodeData = (node: any, data: any) => {
      const key = `${data.milestone.toLowerCase()}_local_dd_flag`;
      const column = `${data.milestone.toLowerCase()}_local_dd`;
  
      node.data[key] = node.data[column] === data.local_dd ? "Y" : "N";
    };
  
    for (const data of interfaceList) {
      api.forEachNode((node: any) => {
        if (node.data.waybill_no !== data.waybill_no) return;
        if (node.data.transport_type === "Reseller" && data.milestone === "POD") {
          if (node.data["DN & Sorting"] === data.delivery_no) {
            updateNodeData(node, data);
          }
        } else {
          updateNodeData(node, data);
        }
      });
    }
  
    gridRef.current.api.refreshCells({ force: true });
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
        {isAddRow && (
          <button className="fixed top-5 left-1/2 transform -translate-x-1/2 py-2 px-4 z-[1000]" onClick={handleCancelAddRow}>
            <div className="flex flex-row items-center justify-center p-3 bg-black border rounded-md drop-shadow-md">
                <GrPowerReset color="white" />
                <span className="inline-block ml-1 text-xs text-white">실행취소</span>
            </div>
          </button>
        )}
      </>
  );
});

export default MasterGrid;
