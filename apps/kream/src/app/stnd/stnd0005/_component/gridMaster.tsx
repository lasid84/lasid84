
'use client';

import { useEffect, useRef, memo } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext, SEARCH_M,crudType } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, { rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community"
import Modal from './popup';
import { PopType } from "@/utils/modal";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    const { searchParams, isMSearch } = objState;


    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    const gridOption: GridOption = {
        colVisible: { col: ["grp_cd", "grp_cd_nm", "cd", "cd_nm", "cd_desc", "cd_mgcd1", "cd_mgcd2", "use_yn"], visible: true },
        gridHeight: "h-full",
        isAutoFitColData: false,
    };

    
    const handleRowDoubleClicked = (param: RowClickedEvent) => {
        var selectedRow = {"colId": param.node.id, ...param.node.data}
        dispatch({ mSelectedRow: selectedRow, isPopUpOpen: true, crudType: PopType.UPDATE })
   
    }

    const handleRowClicked = (param: RowClickedEvent) => {
        // var selectedRow = {"colId": param.node.id, ...param.node.data}
        // dispatch({ mSelectedRow: selectedRow, isPopUpOpen: true, crudType: PopType.UPDATE })
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        // const selectedRow = onSelectionChanged(param);
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow);
        // dispatch({ mSelectedRow: selectedRow, isMSearch: true });
    };

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({ isMSearch: false });
        }
    }, [isMSearch]);

    return (
        <>
            <Grid
                gridRef={gridRef}
                //loadItem={initData}
                listItem={mainData as gridData}
                options={gridOption}
                event={{
                     onRowDoubleClicked : handleRowDoubleClicked,
                     onRowClicked: handleRowClicked,
                     onSelectionChanged: handleSelectionChanged,
                }}
            />
            <Modal loadItem={initData} />
        </>

    );
})

export default MasterGrid;