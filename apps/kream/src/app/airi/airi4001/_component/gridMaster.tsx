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
import { toastError, toastSuccess } from "components/toast";
import { PageMGrid4 } from "layouts/grid/grid";
import { Button, DropButton } from "components/button";
import Grid, { ROW_CHANGED, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import {
  CellValueChangedEvent,
  IRowNode,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import {
  useCommonStore,
  AmountInputOptions_g,
  Category,
} from "../_store/store";
import DetailModal from "./Detail/popup";
import { DatePicker } from "components/date";
import { MaskedInputField } from "@/components/input/react-text-mask";
import ResizableLayout from "../../../stnd/stnd0016/_component/DetailInfo/Layout/ResizableLayout";
import ExcelUploadModal from "./ExcelUpload/popup";
import { v4 as uuidv4 } from "uuid"; // UUID 생성 라이브러리
import { useTranslation } from "react-i18next";
import { ReactSelect, data } from "@/components/select/react-select2";
import { Checkbox } from "@/components/checkbox";
import CustomSelect from "components/select/customSelect";
import RVInfo from "./gridRVInfo";
import ABInfo from "./gridABInfo";

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
  const [closekey, setClosekey] = useState<any>();
  const [uploadkey, setUploadKey] = useState<any>();
  const [custcode, setCustcode] = useState<any>();

  useEffect(() => {
    if (initData?.length) {
      setClosekey(initData[6]);
      setUploadKey(initData[7]);
    }
  }, [initData]);

  //창고료 스타일(자사/타사창고여부) 자사인경우표시
  const bonded_whCellStyles = (params: any) => {
    let data = params.data.loading_loc;
    return data === "KWE" ? "bg-lightorange" : "";
  };

  //운송료 스타일(독차/혼적여부) 혼적인경우표시
  const truckingCellStyles = (params: any) => {
    let data = params.data.group_id;
    return data !== "0" && data !== "" ? "bg-lightskyblue" : "";
  };

  //항공운임료 스타일(자사/타사여부) 타사인경우표시
  const air_freightCellStyles = (params: any) => {
    let data = params.data.waybill_gubn;
    return data === "T" ? "bg-lightpink" : "";
  };

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
        "other_3",
        "special_handling",
        "dtd_handling",
        "kwe_remark",
        "use_yn",
      ],
      visible: true,
    },
    rowSpan: ["waybill_no", "cnee_name"], //, "use_yn"
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
      "kwe_remark",
      "use_yn",
    ],
    checkbox: ["use_yn"],
    isMultiSelect: true,
    total: {
      waybill_no: "count",
      // air_freight: "sum",
      // bl_handling: "sum",
      // bonded_wh: "sum",
      // customs_clearance: "sum",
      // customs_duty: "sum",
      // customs_tax: "sum",
      // dispatch_fee: "sum",
      // special_handling: "sum",
      // dtd_handling: "sum",
      // trucking: "sum",
      // trucking_cost: "sum",
      // insurance_fee: "sum",
    },
    displayCalculatedFields: [
      "bl_handling",
      "bonded_wh",
      "customs_clearance",
      "dispatch_fee",
      "special_handling",
      "dtd_handling",
      "trucking",
      // "insurance_fee",
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
      insurance_fee: "number",
      other_1: "number",
      other_2: "number",
      settlement_date: "date",
    },
    cellClass: {
      trucking: truckingCellStyles,
      air_freight: air_freightCellStyles,
      bonded_wh: bonded_whCellStyles,
      use_yn: (params) => {
        return params.value != "N" ? "bg-pastelGreen" : "bg-pastelCream";
      },
    },
    rowSpanByConfig: {
      targetCol: ["waybill_no", "use_yn", "cnee_name", "kwe_remark"],
      compareCol: {
        waybill_no: ["all"],
      },
      standardCol: "waybill_no",
    },
    columnVerticalCenter: ["waybill_no", "use_yn", "cnee_name", "kwe_remark"],
  };

  /*
    handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
  */
  const handleRowClicked = useCallback((param: RowClickedEvent) => {
    var selectedRow = { colId: param.node.id, ...param.node.data };
  }, []);

  const handleRowDoubleClicked = (param: RowClickedEvent) => {
    const hasunSavedRow = state.allData.some((row) => {
      if (row.__changed == true || row.__ROWTYPE === "NEW") {
        toastError(t("MSG_0205"));
        return true;
      }
      return false;
    });

    if (hasunSavedRow) return;

    const focusedCell = param.api.getFocusedCell();
    var selectedRow = { colId: param.node.id, ...param.node.data };
    var detailIndex = Math.floor(selectedRow?.__ROWINDEX / 2);
    actions.setMainSelectedRow(selectedRow);
    actions.setCurrentRow(selectedRow);
    actions.setDetailIndex(detailIndex);

    if (
      focusedCell?.column &&
      ["waybill_no", "category", "cnee_name"].includes(
        focusedCell.column.getColId()
      )
    ) {
      actions.updatePopup({
        popType: "C",
        isPopupOpen: true,
      });
    }
  };
  const handleCellValueChanged = (param: CellValueChangedEvent) => {
    const updatedKey = param.colDef?.field;

    /**
     * @dev
     * 체크박스는 double click -> data 변경이 아니므로 mainSelectedRow에 포함될 수 없음.
     */
    const checkboxList = gridOption?.checkbox as string[];
    if (checkboxList.includes(updatedKey!)) {
      return;
    }

    if (updatedKey && mainSelectedRow) {
      const updatedRow = {
        ...mainSelectedRow,
        [updatedKey]: param.node.data[updatedKey],
        __changed: true,
      };

      const vatKey = `${updatedKey}_vat`;
      const value = updatedRow[updatedKey];

      // category가 "AB"가 아닐 때만 VAT 계산
      if (
        mainSelectedRow.category !== "AB" &&
        typeof value === "number" &&
        !isNaN(value)
      ) {
        const vatValue = Math.round(value * 0.1); // 1원 반올림 후 10% 계산
        updatedRow[vatKey] = vatValue;
      }

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

  const onCloseDaily = async () => {
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
        actions.getDTDDatas(searchParams);
      }
    }
  };

  const onClosePeriod = async () => {};

  const onUndoClose = async () => {};

  const onGridNew = async () => {
    const newKey = uuidv4(); // 임시 고유 키 생성
    const newRows = [
      {
        waybill_no: "",
        category: "RV",
        use_yn: "Y",
        group_id: "",
        key: newKey,
      },
      {
        waybill_no: "",
        category: "AB",
        use_yn: "Y",
        group_id: "",
        key: newKey,
      },
    ];
    const addedRows = [];
    for (const rowData of newRows) {
      const rows = await rowAdd(gridRef.current, rowData);
      addedRows.push(...rows);
    }
    if (state.mainDatas) {
      state.mainDatas.data.push(...addedRows);
      state.allData.push(...addedRows);
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

      actions.getDomesticDetailDatas({
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

  const handleCheckBoxClick = useCallback(
    (e: any) => {
      if (!mainSelectedRow) return;

      const params = getValues();
      const rowNode = gridApi.getRowNode(mainSelectedRow?.__ROWINDEX - 1);

      const updatedRow = {
        ...mainSelectedRow,
        e: !params[e],
        __changed: true,
      };
      if (rowNode) {
        rowNode.setData(updatedRow);
      }
    },
    [mainSelectedRow]
  );

  const handleVatInputChange = useCallback(
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
      const vatValue = Math.round(numericValue * 0.1);

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

  const handleWaybillInputChange = useCallback(
    (e: any) => {
      if (!mainSelectedRow || !gridApi) return;

      const sanitizedValue =
        typeof e.target.value === "string"
          ? e.target.value.replace(/[^0-9a-zA-Z-]/g, "")
          : e.target.value;

      const updatedRow = {
        ...mainSelectedRow,
        [e.target.id]: sanitizedValue,
        __changed: true,
      };
      actions.setMainSelectedRow(updatedRow);

      const targetIndex = findRowIndexByValue(mainSelectedRow?.key, "key");
      const rowNode = gridApi.getRowNode(mainSelectedRow.__ROWINDEX - 1);
      if (rowNode) {
        rowNode.setData(updatedRow);
      }

      // 다른 rowNode들 업데이트 (waybill_no만 변경)
      targetIndex.forEach((idx) => {
        if (idx !== mainSelectedRow.__ROWINDEX) {
          // 현재 작업 중인 row는 제외
          const rowNode = gridApi.getRowNode(idx - 1);
          if (rowNode) {
            const existingData = rowNode.data;
            const updatedData = {
              ...existingData,
              [e.target.id]: sanitizedValue,
            };
            rowNode.setData(updatedData);
          }
        }
      });
    },
    [mainSelectedRow, gridApi]
  );

  const findRowIndexByValue = (valueToFind: any, columnId: string) => {
    let rowIndexs: number[] = [];

    gridApi.forEachNode((node: any) => {
      if (node.data && node.data[columnId] === valueToFind) {
        rowIndexs.push(node.data["__ROWINDEX"]);
      }
    });

    return rowIndexs;
  };

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
        if (data["waybill_no"] === "") {
          toastError(data["__ROWINDEX"] + "번째 ROW의 " + t("MSG_0206"));
          return;
        }
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
      const result = await actions.saveDomesticInvData({
        jsondata: JSON.stringify(dtd),
        settlement_date: state.uiData.settlement_date,
      });
      if (result) {
        toastSuccess("success");
        actions.getDTDDatas(searchParams);
      }
    }
  };

  const onDropButtonClick = async (e: any) => {
    if (e === null || e === undefined) return;
    switch (e) {
      case 0:
        onCloseDaily();
      case 1:
        onClosePeriod();
      case 2:
        onUndoClose();
    }
  };

  useEffect(() => {
    setGridOptions(gridOption);
  }, []);

  return (
    <>
      <ResizableLayout
        defaultLeftWidth={3000}
        minLeftWidth={1200}
        maxLeftWidth={5000}
        defaultHeight={1000}
        minHeight={700}
        maxHeight={1100}
        ratio={80}
        leftContent={
          <PageMGrid4 title={<></>} right={<></>} rightchildren={<></>}>
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
        }
        rightContent={
          <>
            <>
              <div
                className={` ${state.uiData.isCollapsed ? "hidden" : ""} flex-col w-full h-full col-span-2 p-2`}
              >
                {/* Button */}
                <div className="flex flex-row w-full">
                  <DropButton
                    id={"close_date"}
                    width="w-24"
                    dataSrc={closekey as data}
                    options={{ keyCol: "close_key_nm" }}
                    onClick={onDropButtonClick}
                  />
                  <DropButton
                    id={"upload_excel"}
                    width="w-24"
                    dataSrc={uploadkey as data}
                    options={{ keyCol: "upload_key_nm" }}
                    onClick={onExcelUpload}
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
                </div>

                {/*Master */}
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="waybill_no"
                    value={mainSelectedRow?.waybill_no}
                    events={{
                      onChange: handleWaybillInputChange,
                    }}
                    options={{
                      isReadOnly:
                        mainSelectedRow?.__ROWTYPE === "NEW" ? false : true,
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
               
                <MaskedInputField
                    id="cnee_name"
                    value={mainSelectedRow?.cnee_name}
                    options={{
                      isReadOnly: true,
                      disableSpacing: true,
                    }}
                  />
                  <Checkbox
                      id="overtime_yn"
                      // className="flex-shrink-0"
                      value={mainSelectedRow?.overtime_yn}
                      events={{
                        onChange: handleCheckBoxClick,
                      }}
                    />
                </div>
                {/*AG-Grid Detail*/}
                {mainSelectedRow?.category === Category.RV ? (
                  <RVInfo loadItem={initData} />
                ) : (
                  <ABInfo loadItem={initData} />
                )}
              </div>
            </>
          </>
        }
      />

      <DetailModal loadItem={initData} />
      <ExcelUploadModal loadItem={initData} />
    </>
  );
});

export default MasterGrid;
