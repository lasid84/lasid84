"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { PageGrid } from "layouts/grid/grid";
import { LabelGrid } from "@/components/label";
import { Button } from "components/button";
import {
  CellValueChangedEvent,
  IRowNode,
  SelectionChangedEvent,
} from "ag-grid-community";
import { toastSuccess } from "components/toast";

import { log, error } from '@repo/kwe-lib-new';
import { Store } from "../../_store/store";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

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
  const { getValues, handleSubmit, reset } = useFormContext();
  const gridRef = useRef<any | null>(ref);

  const { excelDatas } = Store((state) => state);
  const actions = Store((state) => state.actions);
  
  const gridOption: GridOption = {
    // colVisible: {
    //   col: ["importidentification", "declarationdate", "arrivalport", "dispatchcountry", "hawb", "mawb", "totaldeclvalue", "incoterms", "exchangerate", "transportfee", "insurancefee", "customsclearancedate", "customsclearancetime", "declarationlinenumber", "hazardcode", "currency", "partnumber", "declarationcustomsvalue", "importduties", "localconsumptiontax", "importvatliability", "importdutyrate"],
    //   visible: true,
    // },
    dataType: {
      decldate: "date", ccdate: "date", cctime: "time",
      totaldeclvalue: "number", exrate:"number", totaldeclfltvalue: "number", totaldeclinsvalue: "number",
      declcustomsvalue: "number", import_duties: "number", local_consumption_tax: "number", import_vat_liability: "number", import_duty_rate: "number",
    },
    gridHeight: "45vh",
    isAutoFitColData: true,
    cellClass: {
      match_m: (params) => {
        return params.value == 'HD가능' ? 'bg-green' : 'bg-red';
      },
      match_d: (params) => {
        return params.value == 'DT가능' ? "bg-green" : "bg-red";
      },
    },
  };

  useEffect(() => {
    
  }, []);


  const handleSelectionChanged = (param: SelectionChangedEvent) => {  };

  const handleCellValueChanged = (param: CellValueChangedEvent) => {  };

  const onSave = async () => {
          const api = gridRef.current.api;
          const changedDatas = [];

          for (const node of api.getRenderedNodes()) {
            var data = node.data;
            gridOption?.checkbox?.forEach((col) => {
              data[col] = data[col] ? "Y" : "N";
            });
            changedDatas.push(data);
          }
          if (changedDatas.length > 0) {
            log("onSvae", JSON.stringify(changedDatas))
            // await actions.insExcelCustomsData({jsonData: JSON.stringify(changedDatas)});
            // await actions.getAppleDatas(getValues());
          } else {
            toast(t("msg_0006"));  //변경 내역이 없습니다.
          }
  };

  return (
    <>
      <PageGrid
        title={
          <>
            <LabelGrid id={t("excel_upload_result")} />
          </>
        }
        right={
          <>
            <Button id={"save"} onClick={onSave} width="w-15" />
          </>
        }
      >
        <Grid
          id="popupGrid"
          gridRef={gridRef}
          listItem={excelDatas}
          options={gridOption}
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
