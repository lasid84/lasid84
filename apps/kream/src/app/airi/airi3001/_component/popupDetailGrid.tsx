"use client";

import { useEffect, useRef, useState } from "react";
import {  SP_UpdateData, SP_GetEDIData } from './data';
import { useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import { PageGrid } from "layouts/grid/grid";
import { LabelGrid } from "@/components/label";
import { Button } from "components/button";
import {
  CellValueChangedEvent,
  IRowNode,
  RowClickedEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import { toastSuccess } from "components/toast";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  ref?: any | null;
  initData?: any | null;
  params: {
    carrier_code: string;
    cont_type: string;
  };
};

const DetailGrid: React.FC<Props> = ({ ref = null, initData, params }) => {
  const gridRef = useRef<any | null>(ref);
  const { dispatch, objState } = useAppContext();
//   const { Create } = useUpdateData2(SP_InsertData, SEARCH_D);
  const { Update } = useUpdateData2(SP_UpdateData, SEARCH_D);
  const [gridOptions, setGridOptions] = useState<GridOption>();

  const {
    data: CarrierContData,
    refetch: CarrierContRefetch,
    remove: CarrierContRemove,
  } = useGetData({ ...params }, SEARCH_D, SP_GetEDIData, { enabled: false });

  const gridOption: GridOption = {
    colVisible: {
      col: ["pic_nm", "email", "tel_num", "fax_num", "remark", "use_yn", "def"],
      visible: true,
    },
    gridHeight: "h-full",
    checkbox: ["use_yn", "def"],
    minWidth: { email: 200 },
    editable: [
      "pic_nm",
      "email",
      "tel_num",
      "fax_num",
      "remark",
      "use_yn",
      "def",
    ],
    dataType: { create_date: "date" },
    isAutoFitColData: false,
  };

  useEffect(() => {
    setGridOptions(gridOption);
    // CarrierContRemove();
    // CarrierContRefetch();
  }, []);

  useEffect(() => {
    if (objState.isDSearch) {
    //   CarrierContRefetch();
      dispatch({ isDSearch: false });
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
  }
  
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
              data.carrier_code = params.carrier_code;
              data.cont_type = params.cont_type;
            //   await Create.mutateAsync(data);
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
            <LabelGrid id={params.cont_type} />
          </>
        }
        right={
          <>
            <Button
              id={"add"}
              onClick={() =>
                rowAdd(gridRef.current, { use_yn: true, def: false })
              }
              width="w-15"
            />
            <Button id={"save"} onClick={onSave} width="w-15" />
          </>
        }
      >
        <Grid
          gridRef={gridRef}
          listItem={CarrierContData as gridData}
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
