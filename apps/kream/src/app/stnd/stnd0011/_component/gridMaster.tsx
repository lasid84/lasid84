
'use client';

import { useEffect, useReducer, useMemo, useCallback, useRef, useState } from "react";
import { SP_GetMasterData } from "./data";
import { PageState, crudType, reducer, useAppContext } from "components/provider/contextObjectProvider";
import { LOAD, SEARCH_M, SEARCH_D } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { PageMGrid } from "layouts/grid/grid";
import { Button } from 'components/button'
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Modal from "components/ufs-interface/popupInterface";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    // initData: any | null;
};

const MasterGrid: React.FC<Props> = ({ }) => {

    // const gridRef = useRef<any | null>(null);
    const { dispatch, objState } = useAppContext();
    // const { searchParams, isMSearch, mSelectedRow } = objState;
    const [gridRef, setGridRef] = useState(objState.gridRef_m);

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(objState?.searchParams, SEARCH_M, SP_GetMasterData, { enabled: false });
    const gridOption: GridOption = {
        colVisible: { col: ["cust_code", "cust_nm", "bz_reg_no"], visible: true },
        gridHeight: "h-full",
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        // checkbox: ["no"],
        // editable: ["trans_mode"],
        dataType: { "bz_reg_no": "bizno" },
        // isMultiSelect: false,
        isAutoFitColData: false,
        isSelectRowAfterRender: true
        // alignLeft: ["major_category", "bill_gr1_nm"],
        // alignRight: [],
    };

    const handleRowClicked = (param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow)
        // dispatch({isDSearch:true});
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {

        // const row = onSelectionChanged(param)
        const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow)
        dispatch({ mSelectedRow: selectedRow, isDSearch: true });

        // document.querySelector('#selectedRows').innerHTML =
        //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    };

    useEffect(() => {
        if (objState.isMSearch) {
            mainRefetch();
            // log("mainisSearch", objState.isMSearch);
            dispatch({ isMSearch: false });
        }
    }, [objState?.isMSearch]);

    useEffect(() => {
        setGridRef(objState.gridRef_m);
    },[objState.gridRef_m])

    const onInterface = () => { dispatch({ crudType: crudType.CREATE, isIFPopUpOpen: true }) }

    return (
        <>
            <PageMGrid>
                <Grid
                    id="gridMaster"
                    gridRef={gridRef}
                    listItem={mainData as gridData}
                    options={gridOption}
                    // domLayout="autoHeight"
                    event={{
                        onRowClicked: handleRowClicked,
                        onSelectionChanged: handleSelectionChanged,
                    }}
                />
            </PageMGrid>
            {/* <Modal /> */}
        </>
    );
}

export default MasterGrid;