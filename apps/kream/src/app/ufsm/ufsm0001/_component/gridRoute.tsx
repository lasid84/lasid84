
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridRoute: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["vad_tz", "etd_tz", "eta_tz", "atd_tz", "ata_tz"], visible: false },
        isShowFilter: false,
        gridHeight: "10vh",
        maxWidth: { "cob":60, "split":60 },
        minWidth: { "mwb_no":150, "vad":150,"etd":180, "eta":180, "ata":180, "atd":180},
        dataType: {"etd":"date", "eta":"date", "atd":"date", "ata":"date", "vad":"date"},
        isAutoFitColData: false,
    };

    log('mainData_ufsm0001_wbSub____',loadData)

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

export default GridRoute;