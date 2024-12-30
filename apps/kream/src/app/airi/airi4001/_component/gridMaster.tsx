"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import {
  useFormContext,
} from "react-hook-form";
import { toastSuccess } from "components/toast";
import { PageMGrid4 } from "layouts/grid/grid";
import { Button } from "components/button";
import Grid, {
  ROW_CHANGED,
  rowAdd,
} from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import dayjs from "dayjs";
import { Store } from "../_store/store";
import DetailModal from "./Detail/popup";
import { DatePicker } from "components/date";
import { MaskedInputField } from "@/components/input/react-text-mask";
import ExcelUploadModal from "./ExcelUpload/popup";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const {getValues } = useFormContext();
  const gridRef = useRef<any | null>(null);
  const state = Store((state) => state);
  const actions = Store((state) => state.actions);
  const mainSelectedRow = Store((state) => state.mainSelectedRow);

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
        "remark"
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
    total: { waybill_no: "count", air_freight:"sum", bl_handling:"sum", bonded_wh:"sum", customs_clearance:"sum"
    , customs_duty:"sum", customs_tax:"sum", dispatch_fee:"sum", special_handling:"sum", dtd_handling:"sum", 
    trucking:"sum", trucking_cost:"sum", other_1:"sum" },
    isAutoFitColData: false,
    isShowRowNo: false,
    dataType : {"air_freight":"number", "bl_handling":"number", "bonded_wh":"number", "customs_clearance":"number"
    , "customs_duty":"number", "customs_tax":"number", "dispatch_fee":"number", "special_handling":"number", "dtd_handling":"number", 
    "trucking":"number", "trucking_cost":"number", "other_1":"number", "settlement_date": "date", },
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
  
    if (focusedCell?.column.getColId() === 'waybill_no') {
      var selectedRow = { colId: param.node.id, ...param.node.data };
      log("handleRowDoubleClicked", selectedRow);
  
      actions.setMainSelectedRow(selectedRow);
      actions.updatePopup({
        popType: "C",
        isPopupOpen: true,
      });
    } else {}
  };

  const handleSelectionChanged = useCallback((param: SelectionChangedEvent) => {
    const selectedRow = param.api.getSelectedRows()[0];
    log('selectedRow', selectedRow)
    
    // dispatch({ mSelectedRow: selectedRow });
    actions.setMainSelectedRow(selectedRow);
  }, []);


  const onExcelUpload = () => {
    actions.updatePopup({
      popType: "C",
      isPopupUploadOpen: true,
    });
  };

  const onGridNew = async () => {
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

  const onGridSave = async () => {
    const dtd : any[] = [];
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
        
        dtd.push(data)
        // if (data[ROW_TYPE] === ROW_TYPE_NEW) {
        //   // const cleanedData = JSON.stringify(data).replace(/\\/g, ''); // 백슬래시 제거
        //   // const jsonData = JSON.stringify([{data: cleanedData}]).replace(/\\/g, '');
        //   // log('dataaaaaa', data, jsonData)
        //   // actions.saveData({ jsondata: `[${jsonData}]` });
        //   // actions.saveData({ jsondata: JSON.stringify(data) });
        // } else {
        //   //수정
        //   const rowIndex = node.rowIndex
        //   const updatedRow = { ...data }
        //   log('수정된 row?', rowIndex, updatedRow)
        //   actions.updateRowData(rowIndex, updatedRow);
        // }
      }
    });
    log('dtd list', dtd)
    if (hasData) {

      const result = await actions.saveData({jsondata : JSON.stringify(dtd), settlement_date:state.uiData.settlement_date })
      log('result',result)
      if(result){
        toastSuccess('success')
        actions.getDTDDatas(state.searchParams)
      }
    }
  };

  useEffect(() => {
    setGridOptions(gridOption);
  }, []);

  return (
    <>
      <PageMGrid4
        title={
          <>
            <div className={"col-span-1"}>
              <DatePicker
                id="date"
                label="settlement_date"
                value={state.uiData.settlement_date}
                options={{
                  inline: true,
                  textAlign: "center",
                  freeStyles: "p-1 border-1 border-slate-300",
                }}
                lwidth="w-20"
                height="h-8"
              />
            </div>
          </>
        }
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
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right", limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  <MaskedInputField
                    id="bonded_wh_vat"
                    value={mainSelectedRow?.bonded_wh_vat}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="customs_clearance"
                    value={mainSelectedRow?.customs_clearance}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right", limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  <MaskedInputField
                    id="customs_clearance_vat"
                    value={mainSelectedRow?.customs_clearance_vat}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="special_handling"
                    value={mainSelectedRow?.special_handling}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  <MaskedInputField
                    id="special_handling_vat"
                    value={mainSelectedRow?.special_handling_vat}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="air_freight"
                    value={mainSelectedRow?.air_freight}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  {/* air freight VAT없음 */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="bl_handling"
                    value={mainSelectedRow?.bl_handling}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  <MaskedInputField
                    id="bl_handling_vat"
                    value={mainSelectedRow?.bl_handling_vat}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="dispatch_fee"
                    value={mainSelectedRow?.dispatch_fee}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  <MaskedInputField
                    id="dispatch_fee_vat"
                    value={mainSelectedRow?.dispatch_fee_vat}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MaskedInputField
                    id="other_1"
                    value={mainSelectedRow?.other_1}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
                    }}
                  />
                  <MaskedInputField
                    id="other_1_vat"
                    value={mainSelectedRow?.other_1_vat}
                    options={{
                      isReadOnly: true, type: "number", textAlign:"right",  limit: 7, isAllowDecimal: true, decimalLimit: 0
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
            onRowDoubleClicked: handleRowDoubleClicked,
            onRowClicked: handleRowClicked,
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageMGrid4>

      <DetailModal loadItem={initData} />
      <ExcelUploadModal loadItem={initData} />
    </>
  );
});

export default MasterGrid;
