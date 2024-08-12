"use client";

import { useRef, memo, useEffect, useState } from "react";
import Grid, {
  ROW_INDEX,
  ROW_TYPE_NEW,
  rowAdd,
} from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import PageSearch, { PageBKCargo } from "layouts/search-form/page-search-row";
import { SP_GetCargoData } from "./data";
import { SEARCH_CGD } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { toastSuccess } from "components/toast";
import { SP_InsertCargo, SP_UpdateCargo } from "./data";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
  mainData: any | null;
};

const GridCargo: React.FC<Props> = memo(({ initData }) => {
  const gridRef = useRef<any | null>(null);
  const gridRefD = useRef<any | null>(null);
  const { dispatch, objState } = useAppContext();
  const { isCGOSearch } = objState;
  const { Create } = useUpdateData2(SP_InsertCargo);
  const { Update } = useUpdateData2(SP_UpdateCargo);
  const [gridOptions, setGridOptions] = useState<GridOption>();
  const [gridDOptions, setGridDOptions] = useState<GridOption>();

  const {
    data: cargoData,
    refetch: cargoRefetch,
    remove: cargoRemove,
  } = useGetData({ no: objState?.MselectedTab }, SEARCH_CGD, SP_GetCargoData, {
    enabled: false,
  });

  useEffect(() => {
    const gridOption: GridOption = {
      colVisible: {
        col: [
          "container_refno",
          "piece",
          "pkg_type",
          "slac_stc",
          "stc_uom",
          "seal_no",
          "container_type",
          "gross_wt",
          "volume_wt",
          "dg_yn",
        ],
        visible: true,
      },
      gridHeight: "25vh",
      checkbox: ["use_yn", "dg_yn", "def"],
      select: {
        pkg_type: initData[17]?.data.map((row: any) => row["type_cd"]),
        container_refno: initData[16]?.data.map(
          (row: any) => row["container_refno"]
        ),
        stc_uom: initData[17]?.data.map((row: any) => row["type_cd"]),
      },

      maxWidth: { piece: 120, slac_stc: 120, container_refno: 120, dg_yn: 80 },
      minWidth: {
        piece: 80,
        slac_stc: 80,
        container_refno: 80,
        dg_yn: 80,
      },
      dataType: {
        piece: "number",
        slac_stc: "number",
        gross_wt: "number",
        volume_wt: "number",
      },
      editable: [
        "piece",
        "pkg_type",
        "slac_stc",
        "stc_uom",
        "container_refno",
        "container_type",
        "seal_no",
        "gross_wt",
        "volume_wt",
        "dg_yn",
      ],
      isShowFilter: false,
      isAutoFitColData: false,
      // isEditableOnlyNewRow: true,
    };
    setGridOptions(gridOption);
  }, []);

  useEffect(() => {
    const gridOption: GridOption = {
      colVisible: {
        col: ["description", "hs_cd"],
        visible: true,
      },
      gridHeight: "25vh",
      checkbox: ["use_yn", "dg_yn", "def"],
      select: {},
      maxWidth: {},
      minWidth: {},
      dataType: {},
      editable: ["description", "hs_cd"],
      isShowFilter: false,
      isAutoFitColData: false,
      // isEditableOnlyNewRow: true,
    };
    setGridDOptions(gridOption);
  }, []);

  useEffect(() => {
    if (objState.isCGOSearch) {
      cargoRefetch();
      dispatch({ isCGOSearch: false });
    }
  }, [objState?.isCGOSearch]);

  const onSave = () => {
    const processNodes = async () => {
      const api = gridRef.current.api;
      for (const node of api.getRenderedNodes()) {
        const Mdata = api.getRowNode(node.data[ROW_INDEX] - 1).data
        const Ddata = (cargoData as gridData).data[node.data[ROW_INDEX] - 1]
        gridOptions?.checkbox?.forEach((col) => {Mdata[col] = Mdata[col] ? "Y" : "N"})
        if (Ddata !== undefined) {
          gridDOptions?.editable?.forEach((col) => {Mdata[col] = Ddata[col] ? Ddata[col] : ""})
        }

        if (Mdata.__changed) {
          try {
            if (Mdata.__ROWTYPE === ROW_TYPE_NEW) {
              await Create.mutateAsync(Mdata);
            } else {
              await Update.mutateAsync(Mdata);
            }
          } catch (error) {
            log.error("error:", error);
          } finally {
            Mdata.__changed = false;
          }
        }
      }
    };
    // Call the async function
    processNodes()
      .then(() => {
        toastSuccess("Success.")
        dispatch({ isCGOSearch :true})
      })
      .catch((error) => {
        log.error("node. Error", error);
      });
  };

  const handleonClick = () => {
    rowAdd(gridRef.current, {
      bk_id: objState.MselectedTab,
      use_yn: true,
      dg_yn: false,
      piece: 1,
    });
    rowAdd(gridRefD.current, {
      ...(cargoData as object),
      bk_id: objState.MselectedTab,
      use_yn: true,
    });
  };

  return (
    <>
      <PageBKCargo
        right={
          <>
            <Button id={"add"} onClick={handleonClick} width="w-15" />
            <Button id={"save"} onClick={onSave} width="w-15" />
          </>
        }
      >
        <>
          <Grid
            gridRef={gridRef}
            listItem={cargoData as gridData} //{mainData?.[1] as gridData}
            options={gridOptions}
            event={{}}
          />
          <Grid
            gridRef={gridRefD}
            listItem={cargoData as gridData}
            options={gridDOptions}
            event={{
              onCellValueChanged(param) {
                var data = param.node.data;
                (cargoData as gridData).data[param.node.data[ROW_INDEX] - 1] = {
                  ...data,
                };
              },
            }}
          />
        </>
      </PageBKCargo>
    </>
  );
});

export default GridCargo;
