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
import { AmountInputOptions_g } from "../_store/store";
import { useTranslation } from "react-i18next";
import { useCommonStore } from "../_store/store";
import { DatePicker } from "components/date";
import Switch from "components/switch/index";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const { t } = useTranslation();
  // const [gridOptions, setGridOptions] = useState<GridOption>();
  const { getValues } = useFormContext();
  const gridRef = useRef<any | null>(null);


  const state = useCommonStore((state) => state);
  const searchParams = useCommonStore((state) => state.searchParams);
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
    
  const { setMainSelectedRow, resetSearchParam, getTransportDatas,assignDTDItem, updatePopup } = useCommonStore((state) => state.actions);

  const [gridApi, setGridApi] = React.useState<any>(null);

  const gridOptions: GridOption = {
    gridHeight: "h-full",
    colVisible: {
      col: [
        // "transport_id",
        // "terminal_cd",
        // "office_cd",
        // "dept_cd",
        "manager_id",
        // "transport_type",
        "task_type",
        // "edit_his",
        "transport_dd",
        // "broker_id",
        // "cnee_id",
        "cnee_nm",
        // "cnee_manager",
        // "cnee_tel_no",
        // "cnee_cell_no",
        // "cnee_email",
        "delivery_request_dd",
        // "delivery_request_tm",
        // "delivery_request_remark",
        "loading_loc",
        "loading_area",
        "loading_dd",
        "unloading_loc",
        "unloading_area",
        "unloading_dd",
        // "unloading_tm",
        // "unloading_manager",
        // "unloading_tel_no",
        // "unloading_cell_no",
        // "unloading_remark",
        "unloading_complete_dd",
        // "unloading_complete_tm",
        // "unloading_report",
        // "cargo_nm",
        // "cargo_standard",
        "cargo_weight",
        // "cargo_type",
        // "cargo_length",
        // "cargo_width",
        // "cargo_height",
        "cargo_qty",
        // "cargo_cbm",
        // "multi_loading",
        // "cargo_weight_unit",
        // "vehicle_type",
        // "vehicle_weight",
        // "transport_remark",
        // "special_condition",
        "mwb_no",
        "waybill_no",
        "invoice_no",
        "customs_type",
        "customs_status",
        "doc_yn",
        "dlv_yn",
        "customs_yn",
        // "dtd_fh",
        "insureance_yn",
        // "on_time_delivery_yn",
        "transport_fee",
        // "transport_fee_expect",
        // "logis_id",
        // "logis_remark",
        // "logis_manager",
        // "logis_tel_no",
        // "logis_email",
        // "driver_id",
        // "driver_type",
        // "driver_nm",
        // "driver_tel_no",
        // "driver_vehicle_no",
        // "driver_bz_reg_no",
        // "driver_vehicle_card",
        // "driver_vehicle_type",
        // "driver_vehicle_weight",
        // "driver_report",
        "driver_status",
        // "transport_seq",
        "status",
        "remark",
        "create_date",
        "create_user",
        "update_date",
        "update_user",
        "ready",
      ],
      visible: true,
    },
    minWidth: {
      transport_id: 100,
      manager_id: 100,
      task_type: 100,
      transport_dd: 100,
      broker_id: 100,
      cnee_nm: 200,
      delivery_request_dd: 100,
      loading_loc: 100,
      loading_area: 100,
      loading_dd: 100,
      unloading_loc: 200,
      unloading_area: 80,
      unloading_dd: 100,
      unloading_complete_dd: 100,
      cargo_weight: 100,
      cargo_qty: 100,
      mwb_no: 200,
      waybill_no: 180,
      invoice_no: 100,
      customs_type: 100,
      customs_status: 100,
      doc_yn: 100,
      dlv_yn: 100,
      customs_yn: 100,
      insureance_yn: 100,
      transport_fee: 100,
      driver_status: 100,
      status: 100,
      remark: 100,
      create_date: 100,
      create_user: 100,
      update_date: 100,
      update_user: 100,
    },
    maxWidth: {
      transport_id: 100,
      manager_id: 100,
      task_type: 100,
      transport_dd: 100,
      broker_id: 100,
      cnee_nm: 200,
      delivery_request_dd: 100,
      loading_loc: 100,
      loading_area: 100,
      loading_dd: 100,
      unloading_loc: 200,
      unloading_area: 80,
      unloading_dd: 100,
      unloading_complete_dd: 100,
      cargo_weight: 100,
      cargo_qty: 100,
      mwb_no: 200,
      waybill_no: 200,
      invoice_no: 100,
      customs_type: 100,
      customs_status: 100,
      doc_yn: 100,
      dlv_yn: 100,
      customs_yn: 100,
      insureance_yn: 100,
      transport_fee: 100,
      driver_status: 100,
      status: 100,
      remark: 100,
      create_date: 100,
      create_user: 100,
      update_date: 100,
      update_user: 100,
    },
    pinned: {
      waybill_no: "left",
      cnee_nm: "left",
      ready : "right",
    },
    editable: ["ready"],
    checkbox: ["ready"],
    total: {
      waybill_no: "count" , cargo_qty : "sum", cargo_weight : "sum"
    },
    dataType: {
      loading_dd : "date",
      delivery_request_dd : "date",
      create_date : "date"
  },
    isAutoFitColData: false,
    isShowRowNo: false,
    isMultiSelect: true,
    cellClass: {
      ready: (params) => {
        return params.value != 'N' ? "bg-pastelGreen" : "bg-pastelCream";
      },
    },
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
    setMainSelectedRow(selectedRow);

    if (focusedCell?.column.getColId() === "waybill_no") {
      updatePopup({
        popType: "C",
        isPopupOpen: true,
      });
    }
  };

  const handleSelectionChanged = useCallback(
    (param: SelectionChangedEvent) => {
      const selectedRow = param.api.getSelectedRows()[0];
      log("selectedRow", selectedRow);
      //TODO - 항목별 VAT적용 차지는 {CHARGE}_VAT KEY생성하여 VAT금액생성 필요

      setMainSelectedRow(selectedRow);
    },
    [mainSelectedRow]
  );
 

  const handleChange = useCallback(
    (e: any, id: any, date: any) => {
      const params = getValues();
      log("params", params, params[id]);
      const updatedRow = {
        ...mainSelectedRow,
        id: params[id],
        __changed: true,
      };
      setMainSelectedRow(updatedRow);
      const rowNode = gridApi.getRowNode(mainSelectedRow?.__ROWINDEX - 1);

      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow]
  );

  const handleSwitchClick = (checked: boolean) => {
    if (!gridRef.current) return;

    const api = gridRef.current.api;
    api.forEachNode((node: any) => {
      const data = node.data;
      data.ready = checked; // 모든 row의 ready 상태 업데이트
      data.__changed = true;
      node.setDataValue("ready", checked ? "Y" : "N"); // ag-Grid 셀 업데이트
    });
    api.refreshCells(); // 그리드 새로고침
  };

  const onSave = async () => {
    const dtd : any [] = []
    var hasData = false;
    gridRef.current.api.forEachNode((node:any)=>{
      var data = node.data
      if (data[ROW_CHANGED]) {
        hasData = true;
        if (gridOptions?.checkbox) {
          for (let i = 0; i < gridOptions?.checkbox?.length; i++) {
            let col = gridOptions?.checkbox[i];
            data[col] = data[col] ? "Y" : "N";
          }
        }

        dtd.push(data);
      }
    })

    if(hasData){
      //청구항목 등록
      const result = await assignDTDItem({
        jsondata: JSON.stringify(dtd),
        settlement_date: state.uiData.settlement_date,
      })
      if (result) {
        toastSuccess(t("MSG_0193"));  
        getTransportDatas(getValues());
      }
    }
   }
 
  return (
    <>
      <PageMGrid3
        title={
          <>
            <DatePicker
              id="settlement_date"
              value={state.uiData?.settlement_date}
              events={{
                onChange: handleChange,
              }}
              options={{
                inline: true,
                textAlign: "center",
                freeStyles: "p-1 border-1 border-slate-300",
              }}
            />
          </>
        }
        right={
          <>
            <Switch onClick={handleSwitchClick} />
            <Button id={"save"} onClick={onSave} width="w-34" />
          </>
        }
      >
        <Grid
          id="gridMaster"
          gridRef={gridRef}
          listItem={state.mainDatas as gridData}
          options={gridOptions}
          event={{
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageMGrid3>
    </>
  );
});

export default MasterGrid;
