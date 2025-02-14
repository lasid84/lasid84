"use client";

import React, {
  useEffect,
  useCallback,
  KeyboardEvent,
  useRef,
  memo,
  useState,
} from "react";
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
// import { TextArea } from "components/input";
import { useCommonStore, AmountInputOptions_g } from "../_store/store";
import DetailModal from "./Detail/popup";
import { DatePicker } from "components/date";
import { MaskedInputField } from "@/components/input/react-text-mask";
import ExcelUploadModal from "./ExcelUpload/popup";
import { v4 as uuidv4 } from "uuid"; // UUID 생성 라이브러리
import { useTranslation } from "react-i18next";
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const { t } = useTranslation();
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const { getValues } = useFormContext();
  const gridRef = useRef<any | null>(null);
  const state = useCommonStore((state) => state);
  const searchParams = useCommonStore((state) => state.searchParams);
  const actions = useCommonStore((state) => state.actions);
  const mainSelectedRow = useCommonStore((state) => state.mainSelectedRow);
  const [gridApi, setGridApi] = React.useState<any>(null);

  const gridOption: GridOption = {
    gridHeight: "h-full",
    colVisible: {
      col: [
        "cnee_name",
        "waybill_no",
        "category",
        "dtd_fh",
        "customs_duty",
        "customs_tax",
        "customs_clearance",
        "air_freight",
        "bl_handling",
        "bonded_wh",
        "dispatch_fee",
        "trucking",
        "insurance_fee",
        "other_1",
        "other_2",
        // "other_3",
        "special_handling",
        "dtd_handling",
        "remark",
        "use_yn",
      ],
      visible: true,
    },

    rowSpan: ["waybill_no","cnee_name"], //, "use_yn"
    pinned: {
      cnee_name: "left",
      waybill_no: "left",
      category: "left",
      use_yn: "right",
    },
    editable: [
      "waybill_no",
      "category",
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
      "insurance_fee",
      "other_1",
      "other_2",
      "other_3",
      "remark",
      "use_yn",
    ],
    checkbox: ["use_yn"],
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
    displayCalculatedFields: [
      "bl_handling",
      "bonded_wh",
      "customs_clearance",
      "dispatch_fee",
      "special_handling",
      "dtd_handling",
      "trucking",
      "insurance_fee",
      "other_1",
      "other_2",
      "other_3",
    ],
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
      use_yn: (params) => {
        return params.value != "N" ? "bg-pastelGreen" : "bg-pastelCream";
      },
    },
  };

  /*
    handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
  */
  const handleRowClicked = useCallback((param: RowClickedEvent) => {
    var selectedRow = { colId: param.node.id, ...param.node.data };
  }, []);

  const handleRowDoubleClicked = (param: RowClickedEvent) => {
    const focusedCell = param.api.getFocusedCell();
    var selectedRow = { colId: param.node.id, ...param.node.data };
    var detailIndex = Math.floor(selectedRow?.__ROWINDEX / 2);
    log('detailIndex',detailIndex, selectedRow)
    actions.setMainSelectedRow(selectedRow);
    actions.setCurrentRow(selectedRow);
    actions.setDetailIndex(detailIndex);

    if (focusedCell?.column && ["waybill_no", "category", "cnee_name"].includes(focusedCell.column.getColId())) {
      actions.updatePopup({
        popType: "C",
        isPopupOpen: true,
      });
    }
  };
  const handleCellValueChanged = (param: CellValueChangedEvent) => {
    const updatedKey = param.colDef?.field;
    if (updatedKey) {
      const updatedRow = {
        ...mainSelectedRow,
        [updatedKey]: param.node.data[updatedKey],
        __changed: true,
      };
      const vatKey = `${updatedKey}_vat`;
      const value = updatedRow[updatedKey];
      if (typeof value === "number" && !isNaN(value)) {
        const vatValue = Math.floor(value * 0.1); // 10% 계산 후 1원 절사
        updatedRow[vatKey] = vatValue;
      }

      // 동일 key를 가진 ROW 모두 업데이트
      if (updatedKey === "waybill_no" && updatedRow.key) {
        const allRows = gridApi.getModel().rowsToDisplay;
        allRows.forEach((rowNode: any) => {
          if (rowNode.data.key === updatedRow.key) {
            rowNode.setData({
              ...rowNode.data,
              waybill_no: param.node.data[updatedKey],
            });
          }
        });
      }
      actions.setMainSelectedRow({ colId: param.node.id, ...updatedRow });

      const rowNode = gridApi.getRowNode(mainSelectedRow?.__ROWINDEX - 1);
      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    }
  };

  const handleSelectionChanged = useCallback(
    (param: SelectionChangedEvent) => {
      const selectedRow = param.api.getSelectedRows()[0];
      log("handleSelectionChanged, selectedRow", selectedRow);
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
  useEffect(() => {
    let curData = getValues();
    log("curData", curData);
  }, [state.searchParams]);

  const onCloseDate = async () => {
    const frDate = searchParams.fr_date; //
    const formattedDate = `${frDate.slice(0, 4)}-${frDate.slice(4, 6)}-${frDate.slice(6, 8)}`;
    const userConfirmed = window.confirm(formattedDate + t("MSG_0196") || "");

    if (userConfirmed) {
      const detail: any[] = [];
      let curData = getValues();
      detail.push(curData);
     
      const result = await actions.updDTDCloseDate({
        jsondata: JSON.stringify(detail),
        settlement_date: frDate,
      });
      if (result) {
        toastSuccess("success");
        actions.getDTDDatas(getValues());
      }
    }
  };

  const onGridNew = async () => {
    const newKey = uuidv4(); // 임시 고유 키 생성
    const newRows = [
      { waybill_no: "", category: "RV", use_yn: "Y", key: newKey },
      { waybill_no: "", category: "AB", use_yn: "Y", key: newKey },
    ];
    const addedRows = [];
    for (const rowData of newRows) {
      const rows = await rowAdd(gridRef.current, rowData);
      addedRows.push(...rows);
    }
    if (state.mainDatas) {
      state.mainDatas.data.push(...addedRows);
    }
  };


  const handleGridReady = useCallback((params: any) => {
    setGridApi(params.api);
  }, []);

  const handleRowDataUpdated = useCallback(
    (params: any) => {
      if (!gridApi) return;

      // 초기화 후 데이터 추가
      state.allData = [];
      gridApi.forEachNode((node: any) => state.allData.push(node.data));
      log("allData", state.allData);
      const filteredWaybills: { waybill_no: string; seq: number }[] = [];
      const waybillSet = new Set();
      state.allData.forEach((row, index) => {
        const key = `${row.waybill_no}_${row.seq}`;

        if (index % 1 === 0 && !waybillSet.has(key)) {
          waybillSet.add(key);
          filteredWaybills.push({ waybill_no: row.waybill_no, seq: row.seq });
        }
      });

      actions.getDTDDetailDatas2({
        jsondata: JSON.stringify(filteredWaybills),
      });
    },
    [state.mainDatas]
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
        // console.warn("Invalid numeric input:", e.target.value);
        return;
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
        // console.warn("Invalid numeric input:", e.target.value);
        return;
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
      const result = await actions.saveDTDData({
        jsondata: JSON.stringify(dtd),
        settlement_date: state.uiData.settlement_date,
      });
      if (result) {
        toastSuccess("success");
        actions.getDTDDatas(getValues());
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
              id={"close_date"}
              onClick={onCloseDate}
              disabled={false}
              label="close_date"
              width="w-14"
            />
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
              width="w-14"
            />
            <Button
              id={"grid_save"}
              label="save"
              onClick={onGridSave}
              width="w-14"
              toolTip="ShortCut: Ctrl+S"
            />
          </>
        }
        rightchildren={
          <>
            <div className="flex-col w-full h-full col-span-2 p-2">
              <div className="grid grid-cols-2 gap-4">
                <MaskedInputField
                  id="waybill_no"
                  value={mainSelectedRow?.waybill_no}
                  options={{
                    isReadOnly: true,
                    disableSpacing: true,
                  }}
                />
                <DatePicker
                  id="settlement_date"
                  value={mainSelectedRow?.settlement_date || ""}
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
              <div className="col-span-2">
                <MaskedInputField
                  id="cnee_name"
                  value={mainSelectedRow?.cnee_name}
                  options={{
                    isReadOnly: true,
                    disableSpacing: true,
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
                {/* K수수료 */}
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
                {/* 보험료() */}
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="insurance_fee"
                    value={mainSelectedRow?.insurance_fee}
                    events={{
                      onChange: handleMaskedInputWithVatUpdate,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: false,
                    }}
                  />
                  {/* <MaskedInputField
                    id="insurance_fee_vat"
                    value={mainSelectedRow?.insurance_fee_vat}
                    events={{
                      onChange: handleMaskedInputChange,
                    }}
                    options={{
                      ...AmountInputOptions_g,
                      isReadOnly: true,
                    }}
                  /> */}
                </div>

                {/* 기타수수료(other1) */}
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

                {/* 항공료 */}
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
                </div>
                {/* H/C */}
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
                {/* 개청료 */}
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

                {/* 비고 */}
                <MaskedInputField
                  id="remark"
                  value={mainSelectedRow?.remark}
                  options={{
                    type: "text",
                    isReadOnly: false,
                  }}
                />
                {/* <TextArea id="remark" rows={3} cols={32} value={mainSelectedRow?.remark} options={{ isReadOnly: false }} /> */}
              </div>
            </div>
          </>
        }
      >
        <Grid
          id="master_4001"
          gridRef={gridRef}
          listItem={state.mainDatas as gridData}
          options={gridOptions}
          event={{
            onGridReady: handleGridReady,
            onCellValueChanged: handleCellValueChanged,
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
            onRowDataUpdated: handleRowDataUpdated,
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
