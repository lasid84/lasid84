"use client";

import { useEffect, useCallback, useRef, memo, useState } from "react";
import {
  crudType,
} from "components/provider/contextObjectProvider";
import { PageMGrid3, PageGrid } from "layouts/grid/grid";
import { Button, ICONButton } from "components/button";
import Grid, { ROW_HIGHLIGHTED,ROW_TYPE_NEW } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import Switch from "components/switch/index"
import { useCommonStore } from "../_store/store";
import ExcelUploadModal from "./ExcelUpload/popup"
import { shallow } from "zustand/shallow";
import { toast } from "react-toastify";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(() => {
  const gridRef = useRef<any | null>(null);

  const loadDatas = useCommonStore((state) => state.loadDatas);
  const maindDatas = useCommonStore((state) => state.mainDatas);
  const actions = useCommonStore((state) => state.actions);
  const { getValues } = useFormContext();

  // const { Create } = useUpdateData2(SP_InsertData, SEARCH_M);
  // const { Update } = useUpdateData2(SP_UpdateData, SEARCH_M);

  const arrTransportType = loadDatas ? loadDatas[3].data?.map((row: any) => row['type_nm']) : [];
  
  const gridOptions: GridOption = {
    gridHeight: "h-full",
    checkbox: ["chk"],
    pinned : {
      // waybill_no : "left",
      // create_date : "right",
      // send : "right",
    },
    colVisible: { col : ["transport_id"], visible:false },
    dataType: { create_date: "date", pickup_dd: "date", delivery_request_dd:"date", revised_edd : "date"
      , num_pieces:"number" , gross_weight:"number", chargeable_weight:"number" },
    typeOptions: {
      gross_weight: { isAllowDecimal: true, decimalLimit:1},
      chargeable_weight: { isAllowDecimal: true, decimalLimit:1},
    }, 
    total: { transport_type_nm:"count", num_pieces:"sum" , gross_weight:"sum", chargeable_weight:"sum" },
    select: { transport_type_nm: arrTransportType },
    isShowRowNo:false,
    isAutoFitColData: true,
    isMultiSelect: false,
    // isEditableAll:true,
    editable: ["transport_type_nm", "delivery_request_dd", "reason"],
    rowSpan: ["origin"],
    cellClass: {
      send: (params) => {
        return params.value != 'N' ? "bg-green" : "bg-red";
      },
    },
  };

  /*
    handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
  */
  // const handleRowClicked = useCallback((param: RowClickedEvent) => {
  //   var selectedRow = {"colId": param.node.id, ...param.node.data}
  //   dispatch({mSelectedRow:selectedRow});
  // }, []);

  // const handleRowDoubleClicked = (param: RowClickedEvent) => {
  //   var selectedRow = { colId: param.node.id, ...param.node.data };
  //   log("handleRowDoubleClicked", selectedRow);
  //   dispatch({
  //     mSelectedRow: selectedRow,
  //     popUp : { ...popUp, crudType: crudType.UPDATE, isPopUpOpen: true }, //추가
  //     isDSearch : true,
  //     isPopUpOpen: true,
  //     crudType: crudType.UPDATE,
  //   });
  // };

  // const handleSelectionChanged = useCallback((param:SelectionChangedEvent) => {
  //   const selectedRow = param.api.getSelectedRows()[0];
  //   dispatch({ mSelectedRow: selectedRow });
  // }, []);



  // useEffect(() => {
  //   if (isMSearch) {
  //     mainRefetch();
  //     dispatch({ isMSearch: false });
  //   }
  // }, [isMSearch]);

  // useEffect(() => {
  //   setGridData(mainData as gridData);
  // }, [mainData]);

  const onSave = async () => {
    
      const api = gridRef.current.api;
      const changedDatas = [];
      for (const node of api.getRenderedNodes()) {
        var data = node.data;
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
        if (data.__changed) {
          if (!data.delivery_request_dd) {
            toast(t("MSG_0191"));  //요청일은 필수 값입니다.
            break;
          }

          try {
            changedDatas.push(data);
          } catch (error) {
            log("error:", error);
          } finally {
            data.__changed = false;
          }
        }
      }
      if (changedDatas.length > 0) {
        await actions.setAppleDatas({jsonData: JSON.stringify(changedDatas)});
        await actions.getAppleDatas(getValues());
      } else {
        toast(t("msg_0006"));  //변경 내역이 없습니다.
      }
  };

  const onDelete = () => {

  }

  const onExcelUpload= () => {
     actions.setState({ popup : { crudType: crudType.CREATE, isPopUpUploadOpen: true }});
  }

  return (
    <>
      <PageMGrid3
        title={<>
                <Button id={"upload_excel"} onClick = {onExcelUpload} disabled={false}  label='upload_excel' width='w-34' />
                 {/* <Button id={"extract_hscode"}  onClick="" width="w-34" toolTip="ShortCut: Ctrl+S"/> */}
              </>
              }
        right={
            <>
              {/* <Switch/> */}
              <Button id={"save"} onClick={onSave} width='w-34' />
              <Button id={"delete"} onClick={onDelete} width='w-34' />
            </>}
      >
        <Grid
          id="gridMaster"
          gridRef={gridRef}
          listItem={maindDatas}
          options={gridOptions}
          event={{
            // onRowDoubleClicked: handleRowDoubleClicked,
            // onRowClicked: handleRowClicked,
            // onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageMGrid3>
      {/* <DetailModal loadItem={initData}/> */}
      <ExcelUploadModal />
    </>
  );
});

export default MasterGrid;
