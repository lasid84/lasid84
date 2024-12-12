
'use client';

import { useEffect, useRef, memo } from "react";
import { SP_GetMasterData } from "./data";
import { useAppContext, SEARCH_M, crudType } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, { rowAdd, ROW_INDEX } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, RowDoubleClickedEvent, SelectionChangedEvent } from "ag-grid-community"
import Modal from './popup';
import { PopType } from "@/utils/modal";
const { decrypt, encrypt } = require('@repo/kwe-lib/components/cryptoJS.js');
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
        colVisible: { col: ["user_id", "user_nm", "permission_id", "bz_plc_code", "emp_no", "ufs_id", "terminal_cd", "dept_cd", "office_cd", "use_yn", "tel_num"], visible: true },
        minWidth: { ROW_INDEX: 10, "user_id":180, "user_nm":120, "permission_id": 200 },
        gridHeight: "h-full",
        isAutoFitColData: false,
    };


    const handleRowClicked = (param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = { "colId": param.node.id, ...param.node.data}
        const ufs_pw2 = decrypt(selectedRow?.ufs_pw)
        var selectedRow2 = {...selectedRow, ufs_pw:ufs_pw2 }
        dispatch({ mSelectedRow: selectedRow2, isPopUpOpen: true, crudType: PopType.UPDATE })
    };

    const handleRowDoubleClicked = (param: RowDoubleClickedEvent) => {
        // var data = onRowClicked(param);
        var selectedRow = { "colId": param.node.id, ...param.node.data}
        const ufs_pw2 = decrypt(selectedRow?.ufs_pw)
        var selectedRow2 = {...selectedRow, ufs_pw:ufs_pw2 }
        dispatch({ mSelectedRow: selectedRow2, isPopUpOpen: true, crudType: PopType.UPDATE })
    };

    const handleSelectionChanged = (param: SelectionChangedEvent) => {
        // const selectedRow = onSelectionChanged(param);
        const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow);
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
                id="gridMaster"
                gridRef={gridRef}
                listItem={mainData as gridData}
                options={gridOption}
                event={{
                    // onRowClicked: handleRowClicked,
                    onRowDoubleClicked: handleRowDoubleClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
            />
            <Modal loadItem={initData} />
        </>

    );
})

export default MasterGrid;