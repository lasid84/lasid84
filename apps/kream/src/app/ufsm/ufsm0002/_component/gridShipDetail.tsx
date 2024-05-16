
'use client';

import { useEffect, useRef, useState } from "react";
import { useAppContext } from "components/provider/contextObjectProvider";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const ShipmentDetailGrid: React.FC<Props> = ({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["piece", "pkg_type", "gross_wt", "gross_uom", "rate_class", "description", "measurement", "measurement_uom", "chargeable_wt", "chargeable_uom", "total"], visible: true },
        gridHeight: "40vh",
        maxWidth: { "piece": 50, "pkg_type": 90, "gross_uom": 70, "mesurement_uom": 70, "chargeable_uom": 70, "rate_class": 70, },
        minWidth: { "piece": 80, "description": 350, "measurement": 100 },
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
}

export default ShipmentDetailGrid;