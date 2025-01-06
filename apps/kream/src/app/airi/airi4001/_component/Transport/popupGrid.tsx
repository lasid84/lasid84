"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { PageGrid } from "layouts/grid/grid";
import { LabelGrid } from "@/components/label";
import { Store } from "../../_store/store";
import {
  CellValueChangedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { toastSuccess } from "components/toast";

const { log } = require("@repo/kwe-lib/components/logHelper");

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
  const excel_data = Store((state)=>state.excel_data)
  const _ExcelUploadGrid = "_ExcelUploadGrid" //grid id

  const gridOption: GridOption = {
    colVisible: {
      col: [ "cnee_id","cnee_name","waybill_no","customs_duty","customs_tax","bonded_wh","customs_clearance",
      "dtd_handling","trucking","other_1","air_freight","dispatch_fee","sum","note"],
      visible: true },
    gridHeight: "40vh",
    isAutoFitColData: true,
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
