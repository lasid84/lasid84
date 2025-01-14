"use client";

import React, { useEffect, useCallback, useRef, memo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toastSuccess } from "components/toast";
import { PageMGrid4 } from "layouts/grid/grid";
import { Button } from "components/button";
import Grid, { ROW_CHANGED, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import {
  CellValueChangedEvent,
  IRowNode,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { Store, AmountInputOptions_g } from "../_store/store";
import DetailModal from "./Detail/popup";
import { DatePicker } from "components/date";
import { MaskedInputField } from "@/components/input/react-text-mask";
import ExcelUploadModal from "./ExcelUpload/popup";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const { getValues } = useFormContext();
  const gridRef = useRef<any | null>(null);
  const state = Store((state) => state);
  const actions = Store((state) => state.actions);
  const mainSelectedRow = Store((state) => state.mainSelectedRow);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [gridApi, setGridApi] = React.useState<any>(null);

  const gridOption: GridOption = {
    gridHeight: "h-full",
    colVisible: {
      col: [
        "cnee_name",
        "waybill_no",
        "customs_duty",
        "customs_tax",
        "customs_clearance",
        "air_freight",
        "bl_handling",
        "bonded_wh",
        "dispatch_fee",
        "trucking",
        "other_1",
        "special_handling",
        "dtd_handling",
        "remark",
      ],
      visible: true,
    },
    minWidth: {
      cnee_id: 80,
      cnee_name: 150,
      waybill_no: 180,
      air_freight: 100,
      bl_handling: 100,
      bonded_wh: 100,
      customs_clearance: 100,
      customs_duty: 100,
      customs_tax: 100,
      dispatch_fee: 100,
      special_handling: 100,
      dtd_handling: 100,
      trucking: 100,
      trucking_cost: 100,
      other_1: 100,
      other_2: 100,
      other_3: 100,
      remark: 100,
      bl_handling_vat: 100,
      bonded_wh_vat: 100,
      customs_clearance_vat: 100,
      dispatch_fee_vat: 100,
      special_handling_vat: 100,
      dtd_handling_vat: 100,
      truckng_vat: 100,
      other_1_vat: 100,
      other_2_vat: 100,
      other_3_vat: 100,
      settlement_date: 100,
      settlement_user: 100,
      create_user: 100,
      create_date: 100,
      update_user: 100,
      update_date: 100,
    },
    maxWidth: {
      cnee_id: 80,
      cnee_name: 150,
      waybill_no: 200,
      air_freight: 100,
      bl_handling: 100,
      bonded_wh: 100,
      customs_clearance: 100,
      customs_duty: 100,
      customs_tax: 100,
      dispatch_fee: 100,
      special_handling: 100,
      dtd_handling: 100,
      trucking: 100,
      trucking_cost: 100,
      other_1: 100,
      other_2: 100,
      other_3: 100,
      remark: 100,
      bl_handling_vat: 100,
      bonded_wh_vat: 100,
      customs_clearance_vat: 100,
      dispatch_fee_vat: 100,
      special_handling_vat: 100,
      dtd_handling_vat: 100,
      truckng_vat: 100,
      other_1_vat: 100,
      other_2_vat: 100,
      other_3_vat: 100,
      settlement_date: 100,
      settlement_user: 100,
      create_user: 100,
      create_date: 100,
      update_user: 100,
      update_date: 100,
    },
    pinned: {
      cnee_name: "left",
      waybill_no: "left",
    },
    editable: [
      "waybill_no",
      "air_freight",
      "bl_handling",
      "bonded_wh",
      "customs_clearance",
      "customs_duty",
      "customs_tax",
      "dispatch_fee",
      "special_handling",
      "dtd_handling",
      "trucking",
      "trucking_cost",
      "other_1",
      "other_2",
      "other_3",
      "remark",
      //  "bl_handling_vat", "bonded_wh_vat", "customs_clearance_vat", "dispatch_fee_vat", "special_handling_vat", "dtd_handling_vat", "truckng_vat", "other_1_vat", "other_2_vat", "other_3_vat", "settlement_date",
    ],
    checkbox: ["ready"],
    isMultiSelect: true,
    total: {
      waybill_no: "count",
      air_freight: "sum",
      bl_handling: "sum",
      bonded_wh: "sum",
      customs_clearance: "sum",
      customs_duty: "sum",
      customs_tax: "sum",
      dispatch_fee: "sum",
      special_handling: "sum",
      dtd_handling: "sum",
      trucking: "sum",
      trucking_cost: "sum",
      other_1: "sum",
    },
    isAutoFitColData: false,
    isShowRowNo: false,
    dataType: {
      air_freight: "number",
      bl_handling: "number",
      bonded_wh: "number",
      customs_clearance: "number",
      customs_duty: "number",
      customs_tax: "number",
      dispatch_fee: "number",
      special_handling: "number",
      dtd_handling: "number",
      trucking: "number",
      trucking_cost: "number",
      other_1: "number",
      settlement_date: "date",
    },
    cellClass: {
      send: (params) => {
        return params.value != "N" ? "bg-green" : "bg-red";
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
    actions.setMainSelectedRow(selectedRow);

    if (focusedCell?.column.getColId() === "waybill_no") {
      actions.updatePopup({
        popType: "C",
        isPopupOpen: true,
      });
    }
  };

  const handleCellValueChanged = (param: CellValueChangedEvent) => {
    const updatedKey = param.colDef?.field;

    if (updatedKey) {
      const vatKey = `${updatedKey}_vat`;
      //TODO - 기존값이 있을때와 없을때 동작 구분필요(key값 확인)
      // 기존 데이터를 유지하며 새로운 값을 병합
      const updatedRow = {
        ...mainSelectedRow,
        ...param.node.data,
      };

      const value = updatedRow[updatedKey];
      if (typeof value === "number" && !isNaN(value)) {
        const vatValue = Math.floor(value * 0.1); // 10% 계산 후 1원 절사
        updatedRow[vatKey] = vatValue;
      }
      actions.setMainSelectedRow({ colId: param.node.id, ...updatedRow });
    }
  };

  const handleSelectionChanged = useCallback(
    (param: SelectionChangedEvent) => {
      const selectedRow = param.api.getSelectedRows()[0];
      log("selectedRow", selectedRow);
      //TODO - 항목별 VAT적용 차지는 {CHARGE}_VAT KEY생성하여 VAT금액생성 필요

      // dispatch({ mSelectedRow: selectedRow });
      actions.setMainSelectedRow(selectedRow);
    },
    [mainSelectedRow]
  );

  const onExcelUpload = () => {
    actions.updatePopup({
      popType: "C",
      isPopupUploadOpen: true,
    });
  };

  const onGridNew = async () => {
    var rows = await rowAdd(gridRef.current, { waybill_no: "" });

    for (const row of rows) {
      log("onGridNew", row, state.mainDatas);
      await (state.mainDatas as any).data.push(row);
    }
  };

  //TODO - GRID ROW 삭제기능 생성필요
  const onGridDelete = async () => {
    // var selectedRow = { "colId": param.node.id, ...param.node.data }
    // if (objState.tab1) {

    var rows = await rowAdd(gridRef.current, { waybill_no: "" });

    for (const row of rows) {
      log("onGridNew", row, state.mainDatas);
      await (state.mainDatas as any).data.push(row);
    }

    setTimeout(() => {
      // dispatch({ [tabName] : rows[0] , MselectedTab: tabName, isCGDSearch : true });
      //dispatch({mSelectedRow: ...mSelectedRow, })
    }, 200);
    // }
  };
  const handleGridReady = useCallback((params: any) => {
    setGridApi(params.api);
  }, []);

  const handleChange = useCallback(
    (e: any, id: any, date: any) => {
      const params = getValues();
      log("params", params, params[id]);
      const updatedRow = {
        ...mainSelectedRow,
        id: params[id],
        __changed: true,
      };
      actions.setMainSelectedRow(updatedRow);
      const rowNode = gridApi.getRowNode(mainSelectedRow?.__ROWINDEX - 1);

      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow]
  );

  const handleMaskedInputChange = useCallback(
    (e: any) => {
      if (!mainSelectedRow || !gridApi) return;

      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;

      const numericValue = Number(sanitizedValue);

      if (isNaN(numericValue)) {
        console.warn("Invalid numeric input:", e.target.value);
        return; // 숫자로 변환할 수 없는 경우 처리 중단
      }

      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.floor(numericValue * 0.1);

      const updatedRow = {
        ...mainSelectedRow,
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      };
      actions.setMainSelectedRow(updatedRow);

      const rowNode = gridApi.getRowNode(mainSelectedRow.__ROWINDEX - 1);
      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow, gridApi]
  );

  const handleMaskedInputWithVatUpdate = useCallback(
    (e: any) => {
      if (!mainSelectedRow || !gridApi) return;

      // 문자열에서 ',' 제거 후 숫자로 변환
      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/,/g, "")
          : e.target.value;

      const numericValue = Number(sanitizedValue);

      if (isNaN(numericValue)) {
        console.warn("Invalid numeric input:", e.target.value);
        return; // 숫자로 변환할 수 없는 경우 처리 중단
      }

      const vatKey = `${e.target.id}_vat`;
      const vatValue = Math.floor(numericValue * 0.1);

      const updatedRow = {
        ...mainSelectedRow,
        [e.target.id]: numericValue,
        [vatKey]: vatValue,
        __changed: true,
      };

      actions.setMainSelectedRow(updatedRow);
      const rowNode = gridApi.getRowNode(mainSelectedRow.__ROWINDEX - 1);

      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow, gridApi]
  );

  const onGridSave = async () => {
    const dtd: any[] = [];
    var hasData = false;
    gridRef.current.api.forEachNode((node: any) => {
      var data = node.data;
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
    });
    if (hasData) {
      const result = await actions.saveData({
        jsondata: JSON.stringify(dtd),
        settlement_date: state.uiData.settlement_date,
      });
      if (result) {
        toastSuccess("success");
        actions.getDTDDatas(state.searchParams);
      }
    }
  };

  useEffect(() => {
    setGridOptions(gridOption);
  }, []);

  return (
    <>
      <PageMGrid4
        title={<></>}
        right={
          <>
            <Button
              id={"upload_excel"}
              onClick={onExcelUpload}
              disabled={false}
              label="upload_excel"
              width="w-34"
            />
            <Button
              id={"gird_new"}
              label="new"
              onClick={onGridNew}
              width="w-20"
            />
            <Button
              id={"grid_save"}
              label="save"
              onClick={onGridSave}
              width="w-20"
              toolTip="ShortCut: Ctrl+S"
            />
          </>
        }
        rightchildren={
          <>
            <div className="flex-col w-full h-full col-span-2 p-4">
              <div className="col-span-2 p-4">
                <MaskedInputField
                  id="waybill_no"
                  value={mainSelectedRow?.waybill_no}
                  options={{
                    isReadOnly: true,
                  }}
                />
                <MaskedInputField
                  id="cnee_name"
                  value={mainSelectedRow?.cnee_name}
                  options={{
                    isReadOnly: true,
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="bonded_wh"
                    value={mainSelectedRow?.bonded_wh}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="bonded_wh_vat"
                    value={mainSelectedRow?.bonded_wh_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="customs_clearance"
                    value={mainSelectedRow?.customs_clearance}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="customs_clearance_vat"
                    value={mainSelectedRow?.customs_clearance_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="special_handling"
                    value={mainSelectedRow?.special_handling}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="special_handling_vat"
                    value={mainSelectedRow?.special_handling_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>
                {/* 운송료 */}
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="trucking"
                    value={mainSelectedRow?.trucking}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="trucking_vat"
                    value={mainSelectedRow?.trucking_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>
                {/* 항공료  */}
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="other_1"
                    value={mainSelectedRow?.other_1}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="other_1_vat"
                    value={mainSelectedRow?.other_1_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="air_freight"
                    value={mainSelectedRow?.air_freight}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  {/* air freight VAT없음 */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="bl_handling"
                    value={mainSelectedRow?.bl_handling}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="bl_handling_vat"
                    value={mainSelectedRow?.bl_handling_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="dispatch_fee"
                    value={mainSelectedRow?.dispatch_fee}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="dispatch_fee_vat"
                    value={mainSelectedRow?.dispatch_fee_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="dtd_handling"
                    value={mainSelectedRow?.dtd_handling}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  <MaskedInputField
                    id="dtd_handling_vat"
                    value={mainSelectedRow?.dtd_handling_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                </div>

                {/* 비고 */}
                <MaskedInputField
                  id="remark"
                  value={mainSelectedRow?.remark}
                  events={{
                    onChange: handleMaskedInputWithVatUpdate,
                  }}
                  options={{
                    ...AmountInputOptions_g,
                    isReadOnly: false,
                  }}
                />

                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    id="settlement_date"
                    value={mainSelectedRow?.settlement_date}
                    events={{
                      onChange: handleChange,
                    }}
                   
                    options={{
                      inline: false,
                      textAlign: "center",
                      freeStyles: "p-1 border-1 border-slate-300",
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        }
      >
        <Grid
          id="master"
          gridRef={gridRef}
          listItem={state.mainDatas as gridData}
          options={gridOptions}
          event={{
            onGridReady: handleGridReady,
            onCellValueChanged: handleCellValueChanged,
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageMGrid4>
      <DetailModal loadItem={initData} />
      <ExcelUploadModal loadItem={initData} />
      {/* <Transport loadItem={initData} /> */}
    </>
  );
});

export default MasterGrid;
