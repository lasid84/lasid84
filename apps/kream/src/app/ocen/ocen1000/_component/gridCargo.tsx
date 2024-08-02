"use client";

import { useRef, memo, useEffect, useState } from "react";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import PageSearch, { PageBKCargo } from "layouts/search-form/page-search-row";
import { SP_GetCargoData } from "./data";
import { LOAD, SEARCH_M, SEARCH_CGD } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { toastSuccess } from "components/toast";
import { SP_InsertCargo, SP_UpdateCargo } from "./data";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
  mainData:  any | null;
};

const GridCargo: React.FC<Props> = memo(({ initData}) => {
  const gridRef = useRef<any | null>(null);
  const gridRefD = useRef<any | null>(null);
  const { dispatch, objState } = useAppContext();
  const { Create } = useUpdateData2(SP_InsertCargo);
  const { Update } = useUpdateData2(SP_UpdateCargo);
  const [gridOptions, setGridOptions] = useState<GridOption>();


  const { data: cargoData, refetch: detailRefetch, remove: mainRemove } = useGetData({ no : objState?.MselectedTab }, SEARCH_CGD, SP_GetCargoData, { enabled: true });


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
    checkbox: ["use_yn","dg_yn","def"],
    select: {
      pkg_type: initData[17]?.data.map(
        (row: any) => row["type_cd"]
      ),
      container_refno: initData[16]?.data.map(
        (row: any) => row["container_refno"]
      ),
      stc_uom: initData[17]?.data.map(
        (row: any) => row["type_cd"]
      ),
    },

    maxWidth: { piece: 120, slac_stc: 120, container_refno: 120 ,dg_yn : 80},
    minWidth: {
      piece: 80,
      slac_stc: 80,
      container_refno: 80,
      dg_yn : 80,
    },
    dataType: {"piece":"number","slac_stc":"number","gross_wt":"number","volume_wt":"number"},
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


  const gridOptionDetail: GridOption = {
    colVisible: {
      col: [
      "description",
      "hs_cd",
      ],
      visible: true,
    },
    gridHeight: "25vh",
    checkbox: [],
    select: {    },
    maxWidth: {  },
    minWidth: {  },
    dataType: {},
    editable: [
      "description",
      "hs_cd",
    ],
    isShowFilter: false,
    isAutoFitColData: false,
    // isEditableOnlyNewRow: true,
  };


  const onSave = () => {
    var hasData = false;
    gridRef.current.api.forEachNode((node: any) => {
      var data = node.data;
      log('node.data', data)
      gridOptions?.checkbox?.forEach(
        (col) => (data[col] = data[col] ? "Y" : "N")
      );
      log("===onSave");
      if (data.__changed) {
        hasData = true;
        if (data.__ROWTYPE === ROW_TYPE_NEW) {
          //신규 추가
          data.container_refno = objState.mSelectedRow.container_refno;
          Create.mutate(data);
        } else {
          //수정
          Update.mutate(data);
        }
      }
    });
    // log("onSave", gridRef.current.api, modifiedRows);
    if (hasData) toastSuccess("Success.");
  };

  const handleonClick = () => {
                rowAdd(gridRef.current, {
                  bk_id: objState.MselectedTab,                  
                  use_yn: true,
                  dg_yn : false,
                  piece: 1,
                })
                rowAdd(gridRefD.current, {
                  bk_id: objState.MselectedTab,                  
                  use_yn: true,
                  dg_yn : false,
                  piece: 1,
                })
  }

  return (
    <>
      <PageBKCargo
        right={
          <>
            <Button
              id={"add"}
              onClick={handleonClick}
              width="w-15"
            />
            <Button id={"save"} onClick={onSave} width="w-15" />
          </>
        }
      >
        <>
          <Grid
            gridRef={gridRef}
            listItem={cargoData as gridData}//{mainData?.[1] as gridData}
            options={gridOption}
            event={{}}
          />
          <Grid
            gridRef={gridRefD}
            listItem={cargoData as gridData}
            options={gridOptionDetail}
            event={{}}
          />
        </>
      </PageBKCargo>
    </>
  );
});

export default GridCargo;
