"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { PageGrid } from "layouts/grid/grid";
import { LabelGrid } from "@/components/label";
import { useCommonStore } from "../../_store/store";
import {
  CellValueChangedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
  ref?: any | null;
  initData?: any | null;
  params: {
    waybill_no: string;
    invoice_no: string;
  };
};

const ExcelUploadGrid: React.FC<Props> = ({ ref = null, params }) => {
  const { t } = useTranslation();
  const gridRef = useRef<any | null>(ref);
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const excel_data = useCommonStore((state)=>state.excel_data)
  const _ExcelUploadGrid = "_ExcelUploadGrid_4001" //grid id

  const gridOption: GridOption = {
    colVisible: {
      // "cnee_id","cnee_name","waybill_no","customs_duty","customs_tax","bonded_wh","customs_clearance",
      // "dtd_handling","trucking","other_1","air_freight","dispatch_fee","sum","note"
      col: [],
      visible: false },
     rowSpan: ["cnee_id", "cnee_name"],
     dataType: {
      customs_duty: "number",
      customs_tax: "number",
      bonded_wh: "number",
      bonded_vat: "number",
      customs_clearance: "number",
      customs_clearance_vat: "number",
      dtd_handling: "number",
      dtd_handling_vat: "number",
      trucking: "number",
      trucking_vat: "number",
      insurance_fee: "number",
      special_handling: "number",
      special_handling_vat: "number",
      air_freight: "number",
      dispatch_fee: "number",
      dispatch_fee_vat: "number",
      bl_handling: "number",
      bl_handling_vat: "number",
      other_1: "number",
      other_1_vat: "number",
      sum: "number",
    },
    gridHeight: "40vh",
    isAutoFitColData: true,
    rowSpanByConfig: {
      targetCol: ["waybill_no","seq","cnee_nm","cnee_id"],
      compareCol: {
        waybill_no: ["all"]
      },
      standardCol: "waybill_no"
    },
    columnVerticalCenter: ["waybill_no", "seq",'cnee_nm',"cnee_id"]
  };

  useEffect(() => {
    setGridOptions(gridOption);
  }, []);


  const handleSelectionChanged = (param: SelectionChangedEvent) => {  };

  const handleCellValueChanged = (param: CellValueChangedEvent) => {  };

  return (
    <>
      <PageGrid
        title={
          <>
            <LabelGrid id={t("excel_upload_result")} />
          </>
        }>
        <Grid
          id={_ExcelUploadGrid}
          gridRef={gridRef}
          listItem={excel_data as gridData}
          options={gridOptions}
          event={{
            onCellValueChanged: handleCellValueChanged,
            onSelectionChanged: handleSelectionChanged,
          }}
        />
      </PageGrid>
    </>
  );
};

export default ExcelUploadGrid;
