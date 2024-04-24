
'use client';

import { useEffect, useRef, memo } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridRoute: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: { col: ["vad_tz", "etd_tz", "eta_tz", "atd_tz", "ata_tz"], visible: false },
        isShowFilter: false,
        gridHeight: "150px",
        checkbox: ["cob", "split"],
        colDisable: ["cob", "split"],
        maxWidth: { "cob":60, "split":60 },
        minWidth: { "vad":150,"etd":150, "eta":150, "ata":150, "atd":150},
        dataType: {"etd":"date", "eta":"date", "atd":"date", "ata":"date", "vad":"date"},
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

export default GridRoute;