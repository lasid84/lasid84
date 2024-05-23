
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridCharges: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["charge_code", "charge_desc", "sort_id", "import_export_ind", "ppc_ind", "invoice_wb_amt", "invoice_wb_currency_code", "invoice_charge_amt", "actual_cost_amt", "cost_currency_code", "vendor_id", "vendor_ref_no",  "print_ind", "vat_cat_code_ap"], visible: true },
        gridHeight: "40vh",
        maxWidth: { "print":40, "sort_id": 60, "trans_type": 60 },
        minWidth: { "charge_code": 150, "charge_desc": 300, "waybill_amt": 110, "invoice_amt": 110, "actual_cost": 110, "vendor_id":110, "vendor_ref_no": 150 },
        dataType: { "waybill_amt": "number", "invoice_amt": "number", "actual_cost": "number", "vat_cost": "number" },
        isShowFilter: false,
        isAutoFitColData: false,
    };

    return (
        <Grid
            gridRef={gridRef}
            listItem={loadData as gridData}
            options={gridOption}
            event={{
            }}
        />

    );
});

export default GridCharges;