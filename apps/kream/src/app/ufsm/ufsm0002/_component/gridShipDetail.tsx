
'use client';

import { useEffect, useRef, useState } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    loadData: gridData
};

const ShipmentDetailGrid: React.FC<Props> = ({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["piece", "pkg_type", "gross_wt", "gross_uom", "rate_class", "description", "measurement", "measurement_uom", "chargeable_wt", "chargeable_uom", "total"], visible: true },
        isShowFilter: false,
        gridHeight: "40vh",
        maxWidth: { "piece": 50, "pkg_type": 90, "gross_uom": 70, "mesurement_uom": 70, "chargeable_uom": 70, "rate_class": 70, },
        minWidth: { "piece": 80, "description": 350, "measurement": 130 },
        dataType: { "total": "number", "chargeable_wt":"number"},
        isAutoFitColData: false,
    };

    
    // log('mainData_ufsm0002_shipdetail',loadData)

    return (
        <Grid
            id="gridShipDetail"
            gridRef={gridRef}
            listItem={loadData as gridData}
            options={gridOption}
            event={{
            }}
        />

    );
}

export default ShipmentDetailGrid;