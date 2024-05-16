
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridManifests: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: {
            col: ["manifest_no","port_origin","port_dest","carrier_code","mwb_no"],
            visible: true
        },
        isShowFilter: false,
        gridHeight: "10vh",
        maxWidth: { "manifest_no": 150,},
        minWidth: { "manifest_no": 200, "port_origin": 200, "port_dest": 150, "carrier_code": 100, },
        dataType: { "invoice_dd": "date", "invoice_amt": "number", },
        isAutoFitColData: true,
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

export default GridManifests;