
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
        colVisible: { col: ["seq","vad_tz", "etd_tz", "eta_tz", "atd_tz", "ata_tz"], visible: false },
        isShowFilter: false,
        gridHeight: "15vh",
        checkbox: ["cob", "split"],
        colDisable: ["cob", "split"],
        maxWidth: { "cob":60, "split":60, "mwb_no":150, },
        minWidth: { "vad":150,"etd":150, "eta":150, "ata":150, "atd":150, "mwb_no":150, "flight_voyage_no":80,"dest_city":90, "origin_city":90,"carrier":80,"port_loading":60,"port_unloading":60},
        dataType: {"etd":"date", "eta":"date", "atd":"date", "ata":"date", "vad":"date"},
        isAutoFitColData: false,
    };

    log('mainData_ufsm0002_wbSub____',loadData)

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