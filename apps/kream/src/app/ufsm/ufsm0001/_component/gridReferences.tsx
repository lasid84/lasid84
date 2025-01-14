
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    loadData: gridData
};

const GridReferences: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["partner_cd", "ref_type", "ref_no", "local_ref_no", "use_yn"], visible: true },
        gridHeight: "30vh",
        checkbox: ["use_yn"],
        maxWidth: { "use_yn": 150, "partner_cd":150, "ref_type": 80,},
        minWidth: { "partner_cd": 300, "ref_no": 300, "local_ref_no": 300, },
        isShowFilter: false,
        isAutoFitColData: false,
    };

    return (
        <Grid
            id="gridReferences"
            gridRef={gridRef}
            listItem={loadData as gridData}
            options={gridOption}
            event={{
            }}
        />

    );
});

export default GridReferences;