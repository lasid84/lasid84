
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridInvoices: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: {
            col: ["invoice_no", "invoice_type", "apply_to_invoice", "invoice_sts", "acctg_sts", "billto_cd", "billto_nm", "trans_type", "govt_invoice_no",
                "invoice_dd", "invoice_amt", "invoice_curr"],
            visible: true
        },
        isShowFilter: false,
        gridHeight: "20vh",
        maxWidth: { "invoice_curr": 90, "invoice_dd": 120, "invoice_amt": 150 },
        minWidth: { "invoice_no": 150, "apply_to_invoice": 200, "billto_cd": 150, "billto_nm": 330, "govt_invoice_no": 200, },
        dataType: { "invoice_dd": "date", "invoice_amt": "number", },
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

export default GridInvoices;