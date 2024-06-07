
'use client';

import { useRef, memo, useEffect, useState } from "react";
import Grid, { rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import PageSearch from "layouts/search-form/page-search-row";
import { Button } from "components/button";
import { useAppContext } from "components/provider/contextObjectProvider";
import { useUpdateData2 } from "components/react-query/useMyQuery";
import {toastSuccess} from "components/toast"
import { SP_InsertCharge } from "./data";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridCharges: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { Create } = useUpdateData2(SP_InsertCharge, 'CHARGE');
    const [data, setData] = useState<any>();

    
    // useEffect(() => {
    //     if (loadData) {
    //       setData((loadData as gridData).data[0]);
    //     }
    //   }, [loadData])

    const gridOption: GridOption = {
        colVisible: { col: ["charge_code", "charge_desc", "sort_id", "import_export_ind", "ppc_ind", "invoice_wb_amt", "invoice_wb_currency_code", "invoice_charge_amt", "actual_cost_amt", "cost_currency_code", "vendor_id", "vendor_ref_no",  "print_ind", "vat_cat_code_ap"], visible: true },
        gridHeight: "40vh",
        maxWidth: { "print":40, "sort_id": 60, "trans_type": 60 },
        minWidth: { "charge_code": 150, "charge_desc": 300, "invoice_wb_amt": 110, "invoice_charge_amt": 110, "actual_cost_amt": 110, "vendor_id":110, "vendor_ref_no": 150 },
        dataType: { "invoice_wb_amt": "number", "invoice_charge_amt": "number", "actual_cost_amt": "number" },
        editable: ["charge_code", "charge_desc", "sort_id", "import_export_ind", "ppc_ind", "invoice_wb_amt", "invoice_wb_currency_code", "invoice_charge_amt", "actual_cost_amt", "cost_currency_code", "vendor_id", "vendor_ref_no",  "print_ind", "vat_cat_code_ap"],
        isShowFilter: false,
        isAutoFitColData: false,
        isEditableOnlyNewRow: true,
    };

    const onSave = () => {
        var hasData = false; 
        gridRef.current.api.forEachNode((node:any) => {
            var data = node.data;
            if (data['__changed']) {
                log("onSave - ", data, objState);
                Create.mutate(data)
                ;
                // node.setDataValue('__changed', false);
                // data['__changed'] = false;
                hasData = true;
            }
          });
        // log("onSave", gridRef.current.api, modifiedRows);
        if (hasData) toastSuccess('Success.');

    };

    return (
        <>
            <PageSearch
                right={
                <>
                <Button id={"add"} onClick={() => rowAdd(gridRef.current, {'waybill_no': objState.MselectedTab, 'type': 'I'})} />
                <Button id={"save"} onClick={onSave} />
                </>
            }>
                <></>
            </PageSearch>
            <Grid
                gridRef={gridRef}
                listItem={loadData as gridData}
                options={gridOption}
                event={{
                }}
            />
        </>
    );
});

export default GridCharges;