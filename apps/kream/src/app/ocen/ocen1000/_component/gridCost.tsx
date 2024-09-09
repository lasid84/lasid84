"use client";

import { useRef, memo, useEffect, useState } from "react";
import Grid, { ROW_TYPE_NEW, rowAdd } from "components/grid/ag-grid-enterprise";
import type { GridOption, gridData } from "components/grid/ag-grid-enterprise";
import PageSearch, { PageBKCargo } from "layouts/search-form/page-search-row";
import { SEARCH_CST,SEARCH_D } from "components/provider/contextArrayProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { toastSuccess } from "components/toast";
import { SP_InsertCost, SP_UpdateCost, SP_GetCostData } from "./data";
import IconSelect from 'components/grid/ag-grid-enterprise/iconSelect'
const { log } = require("@repo/kwe-lib/components/logHelper");

type Props = {
  initData?: any | null;
  bkData?: any
};

const GridCost: React.FC<Props> = ({ initData, bkData }) => {
  const gridRef = useRef<any | null>(null);
  const { dispatch, objState } = useAppContext();
  const { Create } = useUpdateData2(SP_InsertCost, SEARCH_D);
  const { Update } = useUpdateData2(SP_UpdateCost, SEARCH_D);
  const [gridOptions, setGridOptions] = useState<GridOption>();

  // const {
  //   data: costData,
  //   refetch: costRefetch,
  //   remove: costRemove,
  // } = useGetData(
  //   { bk_no: objState?.MselectedTab },
  //   SEARCH_CST,
  //   SP_GetCostData,
  //   { enabled: true }
  // );

  // useEffect(() => {
  //   if (objState.isCSTSearch) {
  //     costRefetch();
  //     dispatch({ isCSTSearch: false });
  //   }
  // }, [objState?.isCSTSearch]);

  // useEffect(()=>{
  //   if(costData){
  //     log('costData',costData)
  //   }
  // },[costData])

  useEffect(() => {
    log("useEffect gridCost", bkData);
    const gridOption: GridOption = {
      colVisible: {
        col: ["bk_id", "uuid", "sort_id", "ppc_ind", "cost_currency_code", "invoice_currency_code", "import_export_ind", "invoice_wb_currency_code", "print_ind", "vat_cat_code_ap",
          "type", "use_yn", "create_date", "create_user", "update_date", "update_user" ],
        visible: false,
      },
      gridHeight: "60vh",
      checkbox: ["use_yn"],
      select: {
        invoice_wb_currency_code: initData[19]?.data.map((row: any) => row["curr"]),
        cost_currency_code: initData[19]?.data.map((row: any) => row["curr"]),
      },
      // icon : {
      //   icon : IconSelect,
      //   vendor_id : IconSelect
      // },
      maxWidth: { use_yn: 120 },
      minWidth: {
        use_yn: 70,
      },
      dataType: { "invoice_wb_amt": "number", "invoice_charge_amt": "number", "actual_cost_amt": "number" },
      editable: ["waybill_no", "remark", "charge_code", "charge_desc", "sort_id", "import_export_ind", "ppc_ind", "invoice_wb_amt", "invoice_wb_currency_code", "invoice_charge_amt", "actual_cost_amt", "cost_currency_code", "vendor_id", "vendor_ref_no",  "print_ind", "vat_cat_code_ap"],
      isShowFilter: false,
      isAutoFitColData: false,
    };
    setGridOptions(gridOption);
  }, [initData, bkData]);

  //add - save - update 시 또 add됨
  const onSave = () => {
    var hasData = false;
    gridRef.current.api.forEachNode((node: any) => {
      var data = node.data;
      gridOptions?.checkbox?.forEach(
        (col) => (data[col] = data[col] ? "Y" : "N")
      );
      if (data.__changed) {
        hasData = true;
        if (data.__ROWTYPE === ROW_TYPE_NEW) {
          Create.mutate(data);
        } else {          //수정
          Update.mutate(data);
        }
      }
    });
    if (hasData) toastSuccess("Success.");
  };

  const handleonClick = () => {
    rowAdd(gridRef.current, {
      bk_id: objState.MselectedTab,
      use_yn: true,
      type: 'I',
      waybill_no: bkData?.waybill_no?.split(',').shift()
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
            listItem={bkData?.cost as gridData}
            options={gridOptions}
            event={{}}
          />
        </>
      </PageBKCargo>
    </>
  );
};

export default GridCost;
