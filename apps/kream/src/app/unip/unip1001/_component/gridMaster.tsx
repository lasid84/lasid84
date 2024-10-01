
'use client';

import { useEffect, useCallback, useRef, memo, useState, } from "react";
import { SP_GetCustomsData } from "./data";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid, { ROW_HIGHLIGHTED } from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";


const { log } = require('@repo/kwe-lib/components/logHelper');

type Props = {
    initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState = {} } = useAppContext();
    const { searchParams, isMSearch } = objState;
    const [ gridData, setGridData ] = useState<gridData>();
    const [ gridOption, setGridOption ] = useState<GridOption>();

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetCustomsData, { enabled: false });

    useEffect(() => {
        switch(searchParams?.search_gubn) {
            case "0": //detail
            setGridOption({
                colVisible: { col: ["prgsstts", ROW_HIGHLIGHTED], visible: false },
                // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
                gridHeight: "h-full",
                // checkbox: ["no"],
                // editable: ["trans_mode"],
                dataType: { "prcsdttm": "date", "etprdttm":"date"},
                // isMultiSelect: false,
                isAutoFitColData: true,
                // alignLeft: ["major_category", "bill_gr1_nm"],
                rowSpan: ["rowno", "cargmtno", "mblno", "hblno"],
                isShowRowNo:false,
            });
            break;
            case "1": //summary
            setGridOption({
                colVisible: { col: ["prgsstts"], visible: false },
                gridHeight: "h-full",
                dataType: { "prcsdttm": "date" },
                autoHeightCol: ["summary"],
                maxWidth: { hblno: 200 },
                isShowRowNo:false,
            });
            break;
        }
    }, [searchParams?.search_gubn]);
    
    /*
        handleSelectionChanged보다 handleRowClicked이 먼저 호출됨
    */
    const handleRowDoubleClicked = (param: RowClickedEvent) => {
        var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow);
        dispatch({ mSelectedRow: selectedRow, isPopUpOpen: true, crudType: crudType.UPDATE });
    };

    const handleRowClicked = useCallback((param: RowClickedEvent) => {
        // var data = onRowClicked(param);
        // var selectedRow = { "colId": param.node.id, ...param.node.data }
        // log("handleRowClicked", selectedRow);
        // dispatch({ mSelectedRow: selectedRow, isPopUpOpen: true, crudType: crudType.UPDATE });
    }, []);

    const handleSelectionChanged = useCallback((param: SelectionChangedEvent) => {
        // // const selectedRow = onSelectionChanged(param);
        // const selectedRow = param.api.getSelectedRows()[0];
        // log("handleSelectionChanged", selectedRow);
        // dispatch({mSelectedRow:selectedRow});
        // // document.querySelector('#selectedRows').innerHTML =
        // //   selectedRows.length === 1 ? selectedRows[0].athlete : '';
    }, []);

    useEffect(() => {
        if (isMSearch) {
            mainRefetch();
            dispatch({ isMSearch: false });
        }
    }, [isMSearch]);

    useEffect(() => {
        setGridData(mainData as gridData);
    }, [mainData])

    return (
        <>
            <Grid
                id="master"
                gridRef={gridRef}
                // loadItem={initData}
                listItem={gridData}
                options={gridOption}
                event={{
                    onRowDoubleClicked : handleRowDoubleClicked,
                    onRowClicked: handleRowClicked,
                    onSelectionChanged: handleSelectionChanged,
                }}
            />
        </>

    );
});

export default MasterGrid;