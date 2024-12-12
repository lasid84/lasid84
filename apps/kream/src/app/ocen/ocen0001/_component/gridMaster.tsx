
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import { SP_GetMasterData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageMGrid } from "layouts/grid/grid";
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import { Button } from 'components/button'
import Modal from "components/ufs-interface/popupInterface"
import { SCRAP_UFSP_PROFILE_CARRIER } from "components/ufs-interface/_component/data"

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    // initData: any | null;
};

const MasterGrid: React.FC<Props> = ({  }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });

    const gridOption: GridOption = {
        colVisible: { col: ["carrier_code", "carrier_type", "carrier_nm"], visible: true },
        gridHeight: "h-full",
        minWidth: { "carrier_code": 100, "carrier_type": 90 },
        maxWidth: { "carrier_code": 100, "carrier_type": 90 },
        isAutoFitColData: false,
        isSelectRowAfterRender: true,
    };

    const handleRowClicked = (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow)
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        const selectedRow = param.api.getSelectedRows()[0];

        // let selectedRow3 = { ...selectedRow, type:'sale'}
        // log("handleSelectionChanged", selectedRow2)
        dispatch({ mSelectedRow: selectedRow, isDSearch: true });
        //dispatch({ mSelectedRow: selectedRow, isDSearch: true });
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRemove();
            mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

    return (
        <>
            <PageMGrid>
                <Grid
                    id="gridMaster"
                    gridRef={gridRef}                   
                    listItem={mainData as gridData}
                    options={gridOption}
                    event={{
                        onRowClicked: handleRowClicked,
                        onSelectionChanged: handleSelectionChanged,
                    }}
                />
            </PageMGrid>
            <Modal pgm_code={SCRAP_UFSP_PROFILE_CARRIER}/>
        </>

    );
}

export default MasterGrid;