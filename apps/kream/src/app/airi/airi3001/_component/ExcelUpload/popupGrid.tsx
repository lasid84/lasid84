"use client";

import { useEffect, useRef, useState } from "react";
import { SP_UpdateData, SP_GetEDIDetailData } from "../data";
import { useAppContext } from "components/provider/contextObjectProvider";
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

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  ref?: any | null;
  initData?: any | null;
  params: {
    waybill_no: string;
    invoice_no: string;
  };
};

const DetailGrid: React.FC<Props> = ({ ref = null, initData, params }) => {
  const { t } = useTranslation();
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();  
  const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const {
    data: EDIDetailData,
    refetch: EDIDetailRefetch,
    remove: EDIDetailRemove,
  } = useGetData({ ...params }, SEARCH_D, SP_GetEDIDetailData, { enabled: false });

  const gridOption: GridOption = {
    colVisible: {
      col: ["partnum", "partdesc", "hscode", "coo", "qty", "unitprice","totalunitprice","declnum","currency","declcustomvalue","hkscode","amt01","amt02","amt03","amt04"],
      visible: true,
    },
    gridHeight: "30vh",
    maxWidth: { partnum : 120, hscode : 120, coo:60, qty:60, unitprice : 100, totalunitprice : 100 },    
    minWidth: { partnum : 110, hscode : 110, coo:50, qty:50, unitprice : 80, totalunitprice : 80 },
    editable: [ "declnum","hkscode","currency","declcustomsvalue ","amt01","amt02","amt03","amt04"],
    dataType: { create_date: "date" },
    isAutoFitColData: false,
  };

  useEffect(() => {
    setGridOptions(gridOption);
    // CarrierContRemove();
    EDIDetailRefetch();
  }, []);

  useEffect(() => {
    if (objState.isDSearch) {
      //   CarrierContRefetch();
      log("grid Data?", EDIDetailData);
      EDIDetailRefetch();
      dispatch({ isDSearch: false });

       const fetchDataAsync = async() => {
        const {data: newData } = await EDIDetailRefetch();
        const detail = (newData as string[])[1]? ((newData as string[])[1] as gridData).data : [];
        log('grid Data??? - detail', detail, newData)
      }
      fetchDataAsync()
    }
  }, [objState.isDSearch]);

  const handleSelectionChanged = (param: SelectionChangedEvent) => {
    // const selectedRow = param.api.getSelectedRows()[0];
    // log("handleSelectionChanged", selectedRow)
    // dispatch({ dSelectedRow: selectedRow });
  };

  const handleCellValueChanged = (param: CellValueChangedEvent) => {
    log("handleCellValueChanged");
    gridRef.current.api.forEachNode((node: IRowNode, i: number) => {
      if (!param.node.data.def) return;
      if (node.id === param.node.id) return;

      if (node.data.def === true) {
        node.setDataValue("def", false);
      }
    });
  };

  const onSave = () => {
    const processNodes = async () => {
      const api = gridRef.current.api;
      for (const node of api.getRenderedNodes()) {
        var data = node.data;
        log("onSave data", node.data);
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
          } catch (error) {
            log.error("error:", error);
          } finally {
            data.__changed = false;
          }
        }
      }
    };
    processNodes()
      .then(() => {
        toastSuccess("Success.");
        dispatch({ isDSearch: true });
      })
      .catch((error) => {
        log.error("node. Error", error);
      });
  };

  return (
    <>
      <PageGrid
        title={
          <>
            <LabelGrid id={t("detail")} />
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
          listItem={EDIDetailData as gridData}
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

export default DetailGrid;
