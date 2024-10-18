
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridCFharges: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["origin_city_code", "dest_city_code", "rate", "amount", "waybill_amt", "prepaid", "collect", "waybill_curr", "exchage_rate", "rate_profile_name"], visible: true },
        gridHeight: "10vh",
        maxWidth: { "origin_city_code": 120, "dest_city_code": 120, "trans_type": 60 },
        minWidth: { "charge_code": 150, "charge_desc": 300, "waybill_amt": 100, "invoice_amt": 100, "actual_cost": 100, "vendor_ref_no": 150 },
        dataType: { "prepaid": "number", "collect": "number","waybill_amt": "number", },
        isShowFilter: false,
        isAutoFitColData: false,
    };

    // log('mainData_ufsm0001_gridfcharge____', loadData)

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

export default GridCFharges;