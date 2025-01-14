"use client";

import { useEffect, useRef, useState } from "react";
import { SP_UpdateData, SP_GetEDIDetailData } from "../../_store/data";
import { SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
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
  // const { dispatch, objState } = useAppContext();  
  // const {excel_data} = objState;
  const [ mData, setMData] = useState<gridData>({});

  const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const {
    data: EDIDetailData,
    refetch: EDIDetailRefetch,
    remove: EDIDetailRemove,
  } = useGetData({ ...params }, SEARCH_D, SP_GetEDIDetailData, { enabled: false });

  const gridOption: GridOption = {
    colVisible: {
      col: ["importidentification", "declarationdate", "arrivalport", "dispatchcountry", "hawb", "mawb", "totaldeclvalue", "incoterms", "exchangerate", "transportfee", "insurancefee", "customsclearancedate", "customsclearancetime", "declarationlinenumber", "hazardcode", "currency", "partnumber", "declarationcustomsvalue", "importduties", "localconsumptiontax", "importvatliability", "importdutyrate"],
      visible: true,
    },
    gridHeight: "40vh",
    isAutoFitColData: true,
  };

  useEffect(() => {
    setGridOptions(gridOption);
    EDIDetailRefetch();
  }, []);


  const handleSelectionChanged = (param: SelectionChangedEvent) => {  };

  const handleCellValueChanged = (param: CellValueChangedEvent) => {  };

  const onSave = () => {
    const processNodes = async () => {
      const api = gridRef.current.api;
      for (const node of api.getRenderedNodes()) {
        var data = node.data;
        log("onSave excel upload data", node.data);
        gridOptions?.checkbox?.forEach((col) => {
          data[col] = data[col] ? "Y" : "N";
        });
        if (data.__changed) {
          try {
            if (data.__ROWTYPE === ROW_TYPE_NEW) {
              data.waybill_no = params.waybill_no;
              data.invoice_no = params.invoice_no;
            } else {
              await Update.mutateAsync(data);
            }
          } catch (err) {
            error("error:", err);
          } finally {
            data.__changed = false;
          }
        }
      }
    };
    processNodes()
      .then(() => {
        toastSuccess("Success.");
        // dispatch({ isDSearch: true });
      })
      .catch((err) => {
        error("node. Error", err);
      });
  };

// useEffect(() => {
//      log("excel_data", excel_data);
//     if (Object.keys(excel_data).length) setMData(excel_data);
// }, [excel_data]);

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
          listItem={mData as gridData}
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
