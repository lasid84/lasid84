
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
        colVisible: { col: ["record_id", "charge_code", "charge_desc", "sort_id", "trans_type", "terms","waybill_amt","waybill_curr","invoice_amt","invoice_curr","actual_cost","actual_curr","vendor_id","vendor_ref_no","print","vat_cost"], visible: true },
        gridHeight: "40vh",
        maxWidth: { "record_id":60, "sort_id":60,"trans_type":60 },
        minWidth: { "charge_code":150,"charge_desc":300, "waybill_amt":100, "invoice_amt":100, "actual_cost":100, "vendor_ref_no":150},
        //dataType: {"etd":"date", "eta":"date", "atd":"date", "ata":"date", "vad":"date"},
        isShowFilter: false,
        isAutoFitColData: false,
    };

    log('mainData_ufsm0001_gridcharge____',loadData)

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