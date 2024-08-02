"use client";

import { useRef, memo, useEffect, useState } from "react";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import PageSearch, { PageBKCargo } from "layouts/search-form/page-search-row";
import { SP_GetCostData } from "./data";
import { LOAD, SEARCH_M, SEARCH_CST, SEARCH_HBL } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { toastSuccess } from "components/toast";
import { SP_InsertCost, SP_UpdateCost, SP_GetHouseData } from "./data";

const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
};

const GridCost: React.FC<Props> = memo(({ initData}) => {
  const gridRef = useRef<any | null>(null);
  const { dispatch, objState } = useAppContext();
  const { Create } = useUpdateData2(SP_InsertCost);
  const { Update } = useUpdateData2(SP_UpdateCost);
  const [gridOptions, setGridOptions] = useState<GridOption>();


  const { data: costData, refetch: detailRefetch, remove: mainRemove } = useGetData({ no : objState?.MselectedTab },SEARCH_HBL, SP_GetHouseData, { enabled: true });

  const gridOption: GridOption = {
    colVisible: {
      col: [
        "waybill_no",
        "remark",
        "use_yn",
      ],
      visible: true,
    },
    gridHeight: "60vh",
    checkbox: ["use_yn", "def"],
    select: {    
    },
    maxWidth: { use_yn: 120 },
    minWidth: {
      use_yn: 70
    },
    dataType: {},
    editable: [
      "waybill_no",
      "remark",
      "use_yn",
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
          data.bk_id = objState.mSelectedRow.bk_id;
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
            listItem={costData as gridData}
            options={gridOption}
            event={{}}
          />        
        </>
      </PageBKCargo>
    </>
  );
});

export default GridCost;
