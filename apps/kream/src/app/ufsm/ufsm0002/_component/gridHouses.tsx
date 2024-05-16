
'use client';

import { useRef, memo } from "react";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    loadData: gridData
};

const GridHouses: React.FC<Props> = memo(({ loadData }) => {

    const gridRef = useRef<any | null>(null);

    const gridOption: GridOption = {
        colVisible: {
            col: ["waybill_no","shipper_name","cnee_name","origin_city_code"],
            visible: true
        },
        isShowFilter: false,
        gridHeight: "20vh",
        maxWidth: {  "waybill_no": 150, "shipper_name":700 ,"cnee_name":700 },
        minWidth: { "waybill_no": 150, "shipper_name":400 ,"cnee_name":400 },
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

export default GridHouses;