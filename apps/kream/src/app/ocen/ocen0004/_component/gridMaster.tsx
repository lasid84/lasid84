
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetMasterData, SP_InsertMaster, SP_UpdateMaster } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import { useGetData, useUpdateData2 } from "components/react-query/useMyQuery";
import Grid, { ROW_TYPE_NEW, rowAdd } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';

import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";

const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    // initData: any | null;
};

const MasterGrid: React.FC<Props> = ({  }) => {

    // const gridRef = useRef<any | null>(null);
    
    const { dispatch, objState } = useAppContext();
    
    const [gridRef, setGridRef] = useState(objState.gridRef_m);
    
    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    const gridOption: GridOption = {
        colVisible: { col: ["addr", "area_code", "remark", "use_yn", "create_date", "create_user", "update_date", "update_user"], visible: false },
        maxWidth: {"place_code":100, "area_nm":100},
        gridHeight: "h-full",
        isAutoFitColData: false,
        isSelectRowAfterRender:true,
        editable:["place_code", "place_nm", ""],
        isEditableOnlyNewRow:true
    };

    const handleRowClicked = (param: RowClickedEvent) => {
        // // var data = onRowClicked(param);
        // var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow)
        // // dispatch({isDSearch:true});
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {

        // const row = onSelectionChanged(param)
        const selectedRow = param.api.getSelectedRows()[0];
        log("handleSelectionChanged", selectedRow)
        dispatch({ mSelectedRow: {...selectedRow }, isDSearch: true });

        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    useEffect(() => {
        if (objState.isMSearch) {
            // mainRemove();
            mainRefetch();
            log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    // useEffect(() => {
    //     log("useEffect gridRef", )
    //     if (gridRef) {
    //         setGridRef(gridRef);
    //         dispatch({gridRef_m:gridRef});
            
    //     }
    // }, [gridRef])

    return (
        // <PageMGrid
        //     right={
        //         <>
        //             <Button id={"add_m"} onClick={onAddContainerYard} width={`w-20`}/>
        //             <Button id={"save_m"} onClick={onSaveContainerYard} width={`w-20`}/>
        //         </>
        //     }>
            <Grid
                gridRef={gridRef}
                listItem={mainData as gridData}
                options={gridOption}
                event={{
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
            />
        // </PageMGrid>
    );
}

export default MasterGrid;