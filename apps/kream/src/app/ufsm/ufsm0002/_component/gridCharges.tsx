
'use client';

import { useRef,memo} from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: any | null;
};

const ChargesGrid: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["charge_code", "charge_desc", "trans_type", "terms", "waybill_amt", "waybill_curr", "invoice_amt", "invoice_curr", "actual_cost", "actual_curr", "vendor_id", "vendor_ref_no", "print", "vat_cost"], visible: true },
        gridHeight: "40vh",
        maxWidth: { "print":40, "sort_id": 60, "trans_type": 60 },
        minWidth: { "charge_code": 150, "charge_desc": 300, "waybill_amt": 130, "waybill_curr":90, "invoice_amt": 110,"invoice_curr":90, "actual_cost": 110, "actual_curr":90,"vendor_id":110, "vendor_ref_no": 150, "trans_type":40, "terms":40 },
        dataType: { "waybill_amt": "number", "invoice_amt": "number", "actual_cost": "number", "vat_cost": "number" },
        isShowFilter: false,
        isAutoFitColData: false,
    };

    return (
        <Grid
            id="gridCharges"
            gridRef={gridRef}
            listItem={loadData as gridData}
            options={gridOption}
            event={{
            }}
        />
    );
})

export default ChargesGrid;