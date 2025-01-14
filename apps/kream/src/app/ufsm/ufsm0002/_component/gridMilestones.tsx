
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    loadData: gridData
};

const GridMilestones: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["local_dd", "port", "location", "milestone", "description","remark" ], visible: true },
        gridHeight: "40vh",
        maxWidth: { "create_dd": 200, "local_dd": 200, "port": 100, "dest_city_code": 150, "trans_type": 60, "milestone":150 },
        minWidth: { "create_dd": 170, "local_dd": 170, "description": 300, },
        dataType: {"local_dd":"date", "create_dd":"date"},
        isShowFilter: false,
        isAutoFitColData: false,
    };

    return (
        <Grid
            id="gridMilestones"
            gridRef={gridRef}
            listItem={loadData as gridData}
            options={gridOption}
            event={{
            }}
        />

    );
});

export default GridMilestones;