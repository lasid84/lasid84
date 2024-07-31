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
};

const GridCost: React.FC<Props> = memo(({ initData}) => {
  const gridRef = useRef<any | null>(null);
  const { dispatch, objState } = useAppContext();
  const { Create } = useUpdateData2(SP_InsertCargo);
  const { Update } = useUpdateData2(SP_UpdateCargo);
  const [gridOptions, setGridOptions] = useState<GridOption>();


  const { data: detailData, refetch: detailRefetch, remove: mainRemove } = useGetData({ no : objState?.MselectedTab }, SEARCH_CGD, SP_GetCargoData, { enabled: true });

  const gridOption: GridOption = {
    colVisible: {
      col: [
        "container_refno",
        "piece",
        "container_type",
        "seal_no",
        "slac_stc",
        "gross_wt",
        "volume_wt",
      ],
      visible: true,
    },
    gridHeight: "30vh",
    checkbox: ["use_yn", "def"],
    select: {
      container_refno: initData[16]?.data.map(
        (row: any) => row["container_refno"]
      ),
    },
    maxWidth: { piece: 70, slac_stc: 70, container_ref_no: 100 },
    minWidth: {
      piece: 80,
      slac_stc: 80,
      container_ref_no: 100,
    },
    dataType: {"piece":"number","slac_stc":"number","gross_wt":"number","volume_wt":"number"},
    editable: [
      "piece",
      "slac_stc",
      "container_refno",
      "container_type",
      "seal_no",
      "gross_wt",
      "volume_wt",
    ],
    isShowFilter: false,
    isAutoFitColData: false,
    isEditableOnlyNewRow: true,
  };

  const onSave = () => {
    var hasData = false;
    gridRef.current.api.forEachNode((node: any) => {
      var data = node.data;
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
            listItem={detailData as gridData}//{mainData?.[1] as gridData}
            options={gridOption}
            event={{}}
          />        
        </>
      </PageBKCargo>
    </>
  );
});

export default GridCost;
