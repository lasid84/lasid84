
'use client';

import { useEffect, useCallback, useRef, memo, } from "react";
import { SP_GetData } from "./data";
import { crudType, useAppContext } from "components/provider/contextObjectProvider";
import { SEARCH_M } from "components/provider/contextObjectProvider";
import { useGetData } from "components/react-query/useMyQuery";
import Grid from 'components/grid/ag-grid-enterprise';
import type { GridOption, gridData } from 'components/grid/ag-grid-enterprise';
import { RowClickedEvent, SelectionChangedEvent } from "ag-grid-community";
import Modal from "./popup";

import { log, error } from '@repo/kwe-lib-new';

type Props = {
    initData?: any | null;
};

const MasterGrid: React.FC<Props> = memo(({ initData }) => {

    const gridRef = useRef<any | null>(null);
    const { dispatch, objState = {} } = useAppContext();
    const { searchParams, isMSearch } = objState;

    const { data: mainData, refetch: mainRefetch, remove: mainRemove } = useGetData(searchParams, SEARCH_M, SP_GetData, { enabled: false });
    const gridOption: GridOption = {
        colVisible: { col: ["trans_mode", "trans_type", "prod_gr_cd", "charge_code", "charge_desc", "vat_yn", "vat_type", "category", "major_category", "report_category", "create_date"], visible: true },
        // colDisable: ["trans_mode", "trans_type", "ass_transaction"],
        gridHeight: "h-full",
        // checkbox: ["no"],
        // editable: ["trans_mode"],
        dataType: { "create_date": "date", "vat_rt": "number" },
        // isMultiSelect: false,
        isAutoFitColData: true,
        alignLeft: ["major_category", "bill_gr1_nm"],
        // alignRight: [],
        // rowadd
        // rowdelete

    };
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

    return (
        <>
            <Grid
                id="gridMaster"
                gridRef={gridRef}
                // loadItem={initData}
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
});

export default MasterGrid;